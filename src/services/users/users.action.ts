'use server';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import {
  type SignInInputSchema,
  type SignUpInputSchema,
} from '~/services/users/users.input';
import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from '~/services/auth';
import { TRPCError } from '@trpc/server';
import { FieldErrors } from 'react-hook-form';
import { CallbackRouteError } from '@auth/core/errors';
import { redirect } from 'next/navigation';
import { userService } from '~/services/users/users.service';

export type PreviousState =
  | FieldErrors<SignInInputSchema>
  | undefined
  | boolean;

export async function signInAction(
  previousState: PreviousState,
  input: SignInInputSchema,
) {
  let redirectFlag = false;
  try {
    await signIn('credentials', {
      ...input,
      redirect: false,
    });

    redirectFlag = true;
    return true;
  } catch (error) {
    redirectFlag = false;
    if (error instanceof CallbackRouteError) {
      const trpcError = error.cause?.err;
      if (trpcError instanceof TRPCError) {
        if (trpcError.code === 'UNAUTHORIZED') {
          return {
            password: {
              message: trpcError.message,
            },
          } as FieldErrors<SignInInputSchema>;
        }

        if (trpcError.code === 'NOT_FOUND') {
          return {
            username: {
              message: trpcError.message,
            },
          } as FieldErrors<SignInInputSchema>;
        }

        if (trpcError.code === 'BAD_REQUEST') {
          const data = JSON.stringify(trpcError.message ?? '{}') as unknown as {
            name: keyof SignInInputSchema;
            message: string;
          };
          return {
            [data.name]: {
              message: [data.message],
            },
          } as FieldErrors<SignInInputSchema>;
        }
      }
    }
  } finally {
    revalidatePath(PAGE_ENDPOINTS.ROOT);
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.ROOT);
    }
  }
}

export async function signUpAction(
  previousState: PreviousState,
  input: SignUpInputSchema,
) {
  let redirectFlag = false;
  try {
    await userService.signup(input);

    await signIn('credentials', {
      ...input,
      redirect: false,
    });

    redirectFlag = true;
    return true;
  } catch (error) {
    redirectFlag = false;
    if (error instanceof TRPCError) {
      if (error.code === 'BAD_REQUEST') {
        return {
          username: {
            message: error.message,
          },
        } as FieldErrors<SignUpInputSchema>;
      }
    }

    if (error instanceof CallbackRouteError) {
      const trpcError = error.cause?.err;
      if (trpcError instanceof TRPCError) {
        if (trpcError.code === 'UNAUTHORIZED') {
          return {
            password: {
              message: trpcError.message,
            },
          } as FieldErrors<SignUpInputSchema>;
        }

        if (trpcError.code === 'NOT_FOUND') {
          return {
            username: {
              message: trpcError.message,
            },
          } as FieldErrors<SignUpInputSchema>;
        }

        if (trpcError.code === 'BAD_REQUEST') {
          const data = JSON.stringify(trpcError.message ?? '{}') as unknown as {
            name: keyof SignUpInputSchema;
            message: string;
          };
          return {
            [data.name]: {
              message: [data.message],
            },
          } as FieldErrors<SignUpInputSchema>;
        }
      }
    }
  } finally {
    revalidatePath(PAGE_ENDPOINTS.ROOT);
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.ROOT);
    }
  }
}

export async function signOutAction(previousState: PreviousState) {
  let redirectFlag = false;
  try {
    const session = await auth();
    if (!session) {
      return false;
    }

    await signOut({
      redirect: false,
    });

    redirectFlag = true;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    console.log('signOutAction');
    revalidatePath(PAGE_ENDPOINTS.ROOT);
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
