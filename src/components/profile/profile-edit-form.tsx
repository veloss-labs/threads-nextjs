'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { api } from '~/services/trpc/react';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  updateProfileSchema,
  type UpdateProfileInputSchema,
} from '~/services/users/users.input';
import { InputLock } from '~/components/ui/input-lock';

interface ProfileEditFormProps {
  username: string;
  initialData?: any;
}

export default function ProfileEditForm({
  initialData,
  username,
}: ProfileEditFormProps) {
  const mutation = api.users.update.useMutation();

  const form = useForm<UpdateProfileInputSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: initialData,
  });

  const onSubmit = (values: UpdateProfileInputSchema) => {
    mutation.mutate(values);
  };

  return (
    <>
      <div className="my-4 grid gap-6">
        <Form {...form}>
          <form id="profile-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <InputLock disabled defaultValue={username} />
              </FormItem>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>소개</FormLabel>
                    <FormControl>
                      <Textarea placeholder="소개를 작성하세요..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>링크</FormLabel>
                    <FormControl>
                      <Input placeholder="www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="flex items-center">
        <Button
          form="profile-edit-form"
          type="submit"
          size="lg"
          className="w-full"
          disabled={mutation.isPending}
          aria-disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          완료
        </Button>
      </div>
    </>
  );
}
