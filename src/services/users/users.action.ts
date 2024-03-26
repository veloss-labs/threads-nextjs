'use server';
import {
  API_ENDPOINTS,
  PAGE_ENDPOINTS,
  STATUS_CODE,
} from '~/constants/constants';
import { generateHash, generateSalt } from '~/utils/password';
import { userService } from '~/services/users/users.service';
import { generatorName } from '~/utils/utils';
import { signIn } from '~/services/auth';
import { authFormSchema } from '~/services/users/users.input';
import { ResultSchema, resultSchema } from '~/services/common/common.schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signupAction(_: ResultSchema | null, formData: FormData) {
  const bindInput = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  const validatedFields = authFormSchema.safeParse(bindInput);

  if (!validatedFields.success) {
    return resultSchema.parse({
      ok: false,
      resultCode: STATUS_CODE.BAD_REQUEST,
      resultMessage: 'Invalid input',
      data: null,
      errors: validatedFields.error.flatten(),
    });
  }

  const input = validatedFields.data;

  const salt = generateSalt();
  const hash = generateHash(input.password, salt);

  const searchParams = new URLSearchParams();
  searchParams.append('seed', input.username);
  const defaultImage = API_ENDPOINTS.avatar(searchParams);

  const name = generatorName(input.username);

  try {
    await userService.create({
      name,
      username: input.username,
      password: hash,
      salt,
      image: defaultImage,
      profile: {
        create: {
          bio: undefined,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return resultSchema.parse({
      ok: false,
      resultCode: STATUS_CODE.SERVER_ERROR,
      resultMessage: 'User creation failed',
      data: null,
      errors: null,
    });
  }

  try {
    await signIn('credentials', {
      username: input.username,
      password: input.password,
      redirect: false,
    });
  } catch (error) {
    console.error(error);
    return resultSchema.parse({
      ok: false,
      resultCode: STATUS_CODE.UNAUTHORIZED,
      resultMessage: 'Sign in failed',
      data: null,
      errors: null,
    });
  }

  revalidatePath(PAGE_ENDPOINTS.AUTH.SIGNUP);
  redirect(PAGE_ENDPOINTS.ROOT);
}

export async function signinAction(_: ResultSchema | null, formData: FormData) {
  const bindInput = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  const validatedFields = authFormSchema.safeParse(bindInput);

  if (!validatedFields.success) {
    return resultSchema.parse({
      ok: false,
      resultCode: STATUS_CODE.BAD_REQUEST,
      resultMessage: 'Invalid input',
      data: null,
      errors: validatedFields.error.flatten(),
    });
  }

  const input = validatedFields.data;

  try {
    await signIn('credentials', {
      username: input.username,
      password: input.password,
      redirect: false,
    });
  } catch (error) {
    console.error(error);
    return resultSchema.parse({
      ok: false,
      resultCode: STATUS_CODE.UNAUTHORIZED,
      resultMessage: 'Sign in failed',
      data: null,
      errors: null,
    });
  }

  revalidatePath(PAGE_ENDPOINTS.AUTH.SIGNIN);
  redirect(PAGE_ENDPOINTS.ROOT);
}
