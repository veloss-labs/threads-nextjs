'server-only';
import difference from 'lodash-es/difference';
import isEqual from 'lodash-es/isEqual';
import { db } from '~/services/db/prisma';
import type {
  LikeListQuerySchema,
  ThreadListQuerySchema,
  RecommendationListQuerySchema,
  FollowListQuerySchema,
  BookmarkListQuerySchema,
} from '~/services/threads/threads.query';
import {
  getThreadsSelector,
  getRecommendationsWithThreadSelector,
} from '~/services/db/selectors/threads';
import { remember } from '@epic-web/remember';
import type {
  CreateInputSchema,
  IdInputSchema,
  UpdateInputSchema,
} from '~/services/threads/threads.input';
import { tagService } from '~/services/tags/tags.service';
import { userService } from '~/services/users/users.service';
import { calculateRankingScore } from '~/utils/utils';
import { taskRunner } from '~/services/task/task';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { env } from '~/app/env';

export class ThreadService {
  private readonly DEFAULT_LIMIT = 30;

  private readonly DEFAULT_RECOMMENDATION_SCORE = 0.001;

  /**
   * @description 스레드의 인기도 추천 계산을 위한 로직
   * @param {string} threadId - 스레드 ID
   * @param {number} likesCount - 좋아요 개수
   */
  async recalculateRanking(threadId: string, likesCount?: number) {
    const item = await db.thread.findUnique({ where: { id: threadId } });
    if (!item) return;
    const likes = likesCount ?? (await this.countLikes(threadId));
    const age =
      (Date.now() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60;
    const score = calculateRankingScore(likes, age);
    return await db.threadStats.upsert({
      where: {
        threadId,
      },
      update: {
        score,
      },
      create: {
        threadId,
        score,
        likes,
      },
    });
  }

  /**
   * @description 스레드 좋아요 개수 업데이트
   * @param {string} threadId - 스레드 ID
   * @param {number} likes - 좋아요 개수
   */
  updateThreadLikes(threadId: string, likes: number) {
    return db.threadStats.upsert({
      where: {
        threadId,
      },
      create: {
        threadId,
        likes,
      },
      update: {
        likes,
      },
    });
  }

  /**
   * @description 스레드 좋아요, 좋아요 취소
   * @param {string} userId - 사용자 ID
   * @param {IdInputSchema} input - 좋아요할 스레드 데이터
   */
  async like(userId: string, input: IdInputSchema) {
    const alreadyLiked = await db.threadLike.findUnique({
      where: {
        threadId_userId: {
          threadId: input.threadId,
          userId,
        },
      },
    });

    // 없으면 좋아요, 있으면 취소
    if (!alreadyLiked) {
      await db.threadLike.create({
        data: {
          threadId: input.threadId,
          userId,
        },
      });
    } else {
      await db.threadLike.delete({
        where: {
          threadId_userId: {
            threadId: input.threadId,
            userId,
          },
        },
      });
    }

    const likes = await this.countLikes(input.threadId);

    taskRunner.registerTask(async () => {
      await this.updateThreadLikes(input.threadId, likes);
      await this.recalculateRanking(input.threadId, likes).catch(console.error);
    });

    return {
      likes,
      liked: !alreadyLiked,
    };

    // TODO: 연산 필요
  }

  /**
   * @description 스레드 수정
   * @param {string} userId - 사용자 ID
   * @param {UpdateInputSchema} input - 수정할 스레드 데이터
   */
  async update(userId: string, input: UpdateInputSchema) {
    const item = await db.thread.findUnique({
      where: {
        id: input.threadId,
        userId,
      },
      select: getThreadsSelector(),
    });

    if (!item) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'item not found' });
    }

    if (item.deleted) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'item deleted' });
    }

    const {
      text,
      htmlJSON,
      mentions,
      hashTags,
      whoCanLeaveComments,
      hiddenNumberOfLikesAndComments,
    } = input;

    const data: Prisma.XOR<
      Prisma.ThreadUpdateInput,
      Prisma.ThreadUncheckedUpdateInput
    > = {};

    if (
      typeof whoCanLeaveComments !== 'undefined' &&
      typeof whoCanLeaveComments !== null &&
      !isEqual(whoCanLeaveComments, item.whoCanLeaveComments)
    ) {
      data.whoCanLeaveComments = whoCanLeaveComments;
    }

    if (
      typeof hiddenNumberOfLikesAndComments !== 'undefined' &&
      typeof hiddenNumberOfLikesAndComments === 'boolean' &&
      !isEqual(
        hiddenNumberOfLikesAndComments,
        item.hiddenNumberOfLikesAndComments,
      )
    ) {
      data.hiddenNumberOfLikesAndComments = hiddenNumberOfLikesAndComments;
    }

    if (text && !isEqual(text, item.text)) {
      data.text = text;
    }

    if (htmlJSON && !isEqual(htmlJSON, item.jsonString)) {
      data.jsonString = htmlJSON;
    }

    const oldMentions = item.mentions
      .map((mention) => mention.user.username)
      .filter(Boolean) as unknown as string[];

    if (mentions && !isEqual(mentions, oldMentions)) {
      const newMentions = mentions.filter(Boolean);

      const diffMentionsRemove = difference(newMentions, oldMentions);
      if (diffMentionsRemove.length > 0) {
        const _verifiedMentions: string[] = [];
        for (const mention of diffMentionsRemove) {
          const data = await userService.byUsername(mention);
          if (data) {
            _verifiedMentions.push(data.id);
          }
        }
        data.mentions = {
          deleteMany: _verifiedMentions.map((userId) => ({
            userId,
          })),
        };
      }

      const diffMentions = difference(oldMentions, newMentions);

      if (diffMentions.length > 0) {
        const _verifiedMentions: string[] = [];
        for (const mention of diffMentions) {
          const data = await userService.byUsername(mention);
          if (data) {
            _verifiedMentions.push(data.id);
          }
        }
        data.mentions = {
          create: _verifiedMentions.map((userId) => ({
            userId,
          })),
        };
      }
    }

    const oldTags = item.tags.map((tag) => tag.tag.name).filter(Boolean);

    if (hashTags && !isEqual(hashTags, oldTags)) {
      const newTags = hashTags.filter(Boolean);
      const diffTagsRemove = difference(newTags, oldTags);

      if (diffTagsRemove.length > 0) {
        const _verifiedTags: string[] = [];
        for (const tag of diffTagsRemove) {
          const data = await tagService.byName(tag);
          if (data) {
            _verifiedTags.push(data.id);
          }
        }
        data.tags = {
          deleteMany: _verifiedTags.map((tagId) => ({
            tagId,
          })),
        };
      }

      const diffTags = difference(oldTags, newTags);
      if (diffTags.length > 0) {
        const _verifiedTags: string[] = [];
        for (const tag of diffTags) {
          const data = await tagService.byName(tag);
          if (data) {
            _verifiedTags.push(data.id);
          }
        }
        data.tags = {
          create: _verifiedTags.map((tagId) => ({
            tagId,
          })),
        };
      }
    }

    return db.thread.update({
      where: {
        id: input.threadId,
        userId,
      },
      data,
    });
  }

  /**
   * @description 스레드 삭제
   * @param {string} userId - 사용자 ID
   * @param {string} threadId - 스레드 ID
   */
  async delete(userId: string, threadId: string) {
    const item = await db.thread.findUnique({
      where: {
        id: threadId,
        userId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!item) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'item not found' });
    }

    return db.thread.update({
      where: {
        id: threadId,
        userId,
      },
      data: {
        deleted: true,
      },
    });
  }

  /**
   * @description 스레드 생성
   * @param {string} userId - 사용자 ID
   * @param {CreateInputSchema} input - 생성할 스레드 데이터
   */
  async create(userId: string, input: CreateInputSchema) {
    const { text, htmlJSON, mentions, hashTags } = input;

    const connectTags: string[] = [];
    if (hashTags) {
      const _verifiedTags: string[] = [];
      for (const tag of hashTags) {
        const foundTag = await tagService.byName(tag);
        if (!foundTag) {
          const data = await tagService.create(userId, { name: tag });
          _verifiedTags.push(data.id);
        } else {
          _verifiedTags.push(foundTag.id);
        }
      }
      connectTags.push(..._verifiedTags);
    }

    const connectMentions: string[] = [];
    if (mentions) {
      const _verifiedMentions: string[] = [];
      for (const mention of mentions) {
        const data = await userService.byUsername(mention);
        if (data) {
          _verifiedMentions.push(data.id);
        }
      }
      connectMentions.push(..._verifiedMentions);
    }

    return await db.thread.create({
      select: {
        id: true,
      },
      data: {
        userId,
        text,
        jsonString: htmlJSON,
        stats: {
          create: {},
        },
        mentions: {
          create: connectMentions.map((userId) => ({
            userId,
          })),
        },
        tags: {
          create: connectTags.map((tagId) => ({
            tagId,
          })),
        },
      },
    });
  }

  /**
   * @description 스레드 상세 조회
   * @param {string} id - 스레드 ID
   */
  byId(id: string) {
    return db.thread.findUnique({
      where: {
        id,
      },
      select: getThreadsSelector(),
    });
  }

  /**
   * @description 스레드 북마크, 북마크 취소
   * @param {string} userId - 사용자 ID
   * @param {string} threadId - 스레드 ID
   */
  async save(userId: string, threadId: string) {
    const alreadySaved = await db.threadBookmark.findUnique({
      where: {
        userId_threadId: {
          userId,
          threadId,
        },
      },
    });

    // 없으면 좋아요, 있으면 취소
    if (!alreadySaved) {
      await db.threadBookmark.create({
        data: {
          threadId,
          userId,
        },
      });
    } else {
      await db.threadBookmark.delete({
        where: {
          userId_threadId: {
            threadId,
            userId,
          },
        },
      });
    }

    const bookmarks = await this.countBookmarks(threadId);

    return {
      bookmarks,
      saved: !alreadySaved,
    };
  }

  /**
   * @description 스레드 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   */
  getItems(userId: string, input: ThreadListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        ...(input?.userId && {
          userId: input.userId,
        }),
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getThreadsSelector(userId, input),
    });
  }

  /**
   * @description 추천 스레드 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {RecommendationListQuerySchema} input - 스레드 목록 조회 조건
   */
  getRecommendations(userId: string, input: RecommendationListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
        userId,
        stats: {
          AND: [
            {
              score: {
                gte: this.DEFAULT_RECOMMENDATION_SCORE,
              },
            },
            {
              thread: {
                user: {
                  id: {
                    not: userId,
                  },
                },
              },
            },
          ],
        },
      },
      orderBy: [
        {
          stats: {
            score: 'desc',
          },
        },
        {
          stats: {
            threadId: 'desc',
          },
        },
      ],
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getRecommendationsWithThreadSelector(userId, input),
    });
  }

  /**
   * @description 내가 팔로우한 사용자의 스레드 목록 조회 & 나 자신의 스레드 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {FollowListQuerySchema} input - 스레드 목록 조회 조건
   */
  getFollows(userId: string, input: FollowListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          {
            userId,
          },
        ],
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getThreadsSelector(userId, input),
    });
  }

  /**
   * @description 좋아요한 스레드 목록 조회
   * @param {string} userId
   * @param {LikeListQuerySchema} input
   */
  getLikes(userId: string, input: LikeListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        userId,
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
        likes: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getThreadsSelector(userId, input),
    });
  }

  /**
   * @description 북마크한 스레드 목록 조회
   * @param {string} userId
   * @param {BookmarkListQuerySchema} input
   */
  getBookmarks(userId: string, input: BookmarkListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
        bookmarks: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getThreadsSelector(userId, input),
    });
  }

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {string} endCursor - 스레드 ID
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   */
  hasNextPage(endCursor: string, input: ThreadListQuerySchema) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        ...(input?.userId && {
          userId: input.userId,
        }),
      },
    });
  }

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {string} endCursor - 스레드 ID
   * @param {LikeListQuerySchema} input - 스레드 목록 조회 조건
   */
  hasNextLikePage(
    userId: string,
    endCursor: string,
    input: LikeListQuerySchema,
  ) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        userId,
        likes: {
          some: {
            userId,
          },
        },
      },
    });
  }

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {string} endCursor - 스레드 ID
   * @param {BookmarkListQuerySchema} input - 스레드 목록 조회 조건
   */
  hasBookmarkPage(
    userId: string,
    endCursor: string,
    input: BookmarkListQuerySchema,
  ) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        bookmarks: {
          some: {
            userId,
          },
        },
      },
    });
  }

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {string} endCursor - 스레드 ID
   * @param {RecommendationListQuerySchema} input - 스레드 목록 조회 조건
   */
  hasRecommendPage(
    userId: string,
    endCursor: string,
    input: RecommendationListQuerySchema,
  ) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        userId,
        stats: {
          AND: [
            {
              score: {
                gte: this.DEFAULT_RECOMMENDATION_SCORE,
              },
            },
            {
              thread: {
                user: {
                  id: {
                    not: userId,
                  },
                },
              },
            },
          ],
        },
      },
      orderBy: [
        {
          stats: {
            score: 'desc',
          },
        },
        {
          stats: {
            threadId: 'desc',
          },
        },
      ],
    });
  }

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {string} endCursor - 스레드 ID
   * @param {FollowListQuerySchema} input - 스레드 목록 조회 조건
   */
  hasFollowPage(
    userId: string,
    endCursor: string,
    input: FollowListQuerySchema,
  ) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          {
            userId,
          },
        ],
      },
    });
  }

  /**
   * @description 특정 스레드의 좋아요 개수 조회
   * @param {string} threadId - 스레드 ID
   */
  countLikes(threadId: string) {
    return db.threadLike.count({
      where: {
        threadId,
      },
    });
  }

  /**
   * @description 특정 스레드의 북마크 개수 조회
   * @param {string} threadId - 스레드 ID
   */
  countBookmarks(threadId: string) {
    return db.threadBookmark.count({
      where: {
        threadId,
      },
    });
  }

  /**
   * @description 스레드 목록 조회 총 개수
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   */
  count(userId: string, input: ThreadListQuerySchema) {
    return db.thread.count({
      where: {
        deleted: false,
        ...(input?.userId && {
          userId: input.userId,
        }),
      },
    });
  }

  /**
   * @description 좋아요 스레드 목록 조회 총 개수
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {LikeListQuerySchema} input - 스레드 목록 조회 조건
   */
  likeCount(userId: string, input: LikeListQuerySchema) {
    return db.thread.count({
      where: {
        deleted: false,
        userId,
        likes: {
          some: {
            userId,
          },
        },
      },
    });
  }

  /**
   * @description 북마크 스레드 목록 조회 총 개수
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {BookmarkListQuerySchema} input - 스레드 목록 조회 조건
   */
  bookmarkCount(userId: string, input: BookmarkListQuerySchema) {
    return db.thread.count({
      where: {
        deleted: false,
        bookmarks: {
          some: {
            userId,
          },
        },
      },
    });
  }

  /**
   * @description 추천 스레드 목록 조회 총 개수
   * @param {string} userId - 사용자 ID
   * @param {RecommendationListQuerySchema} input - 스레드 목록 조회 조건
   */
  recommendCount(userId: string, input: RecommendationListQuerySchema) {
    return db.thread.count({
      where: {
        deleted: false,
        userId,
        stats: {
          AND: [
            {
              score: {
                gte: this.DEFAULT_RECOMMENDATION_SCORE,
              },
            },
            {
              thread: {
                user: {
                  id: {
                    not: userId,
                  },
                },
              },
            },
          ],
        },
      },
    });
  }

  /**
   * @description 팔로우 스레드 목록 조회 총 개수
   * @param {string} userId - 사용자 ID
   * @param {FollowListQuerySchema} input - 스레드 목록 조회 조건
   */
  followCount(userId: string, input: FollowListQuerySchema) {
    return db.thread.count({
      where: {
        deleted: false,
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          {
            userId,
          },
        ],
      },
    });
  }
}

export const threadService =
  env.NODE_ENV === 'development'
    ? new ThreadService()
    : remember('threadService', () => new ThreadService());
