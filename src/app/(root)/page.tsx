import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { getSession } from '~/server/auth';

export default async function Pages() {
  const session = await getSession();
  console.log(`[session] ===>`, session);
  return (
    <div>
      {Array.from({ length: 100 }, (_, i) => i).map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
