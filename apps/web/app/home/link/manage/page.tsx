'use client';
import React, { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import Joi from 'joi';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLink } from '../../../../hooks/useLink';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  long: z.string().url({ message: "Invalid URL" }),
  short: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
}).required();

function ManageLinkPage() {
  const searchParams = useSearchParams();
  const linkId = searchParams.get('id');
  const isCreateMode = !linkId;
  const { createMutation, updateMutation, getQuery,resetLinksCache } = useLink();
  const router = useRouter();

  const { data: linkResponse, isPending, error, refetch } = getQuery(
    { page: 1, limit: 10, keyword: '', id: linkId || undefined }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      long: '',
      short: '',
      status: 'active',
    },
  });

  const getLinkData = async () => {
    if (!linkId) return;

    try {
      if (linkResponse?.data && !error) {
        const linkData = linkResponse.data[0];

        if (linkData) {
          form.setValue('title', linkData.title || '');
          form.setValue('long', linkData.long || '');
          form.setValue('short', linkData.short || '');
          form.setValue('status', linkData.status || 'active');
        } else {
          form.setError('root', {
            message: "Link not found",
            type: 'manual',
          });
        }
      } else if (error) {
        form.setError('root', {
          message: "Failed to fetch link data, please try again later.",
          type: 'manual',
        });
      }
    } catch (err) {
      console.error("Error processing link data:", err);
      form.setError('root', {
        message: "An unexpected error occurred",
        type: 'manual',
      });
    }
  };

  useEffect(() => {
    if (linkId) {
      refetch().then(() => {
        getLinkData();
      });
    }
  }, [linkId]);

  useEffect(() => {
    if (linkId && linkResponse) {
      getLinkData();
    }
  }, [linkResponse]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isCreateMode) {
      createMutation.mutate(values, {
        onSuccess: () => {
          form.reset();
          toast.success("Link created successfully redirecting...");
          resetLinksCache();
          setTimeout(() => {
            router.push('/home/link');
          }, 2000);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || '';

          if (
            errorMessage.includes('already exists')
          ) {
            form.setError('short', {
              message: "Short URL already exists, please choose another one.",
              type: 'manual',
            });
          } else {
            form.setError('root', {
              message: "Create link failed, please try again later.",
              type: 'manual',
            });
          }
        },
      });
    } else {
      updateMutation.mutate({ id: linkId!, data: values }, {
        onSuccess: () => {
          refetch();
          getLinkData();
          toast.success("Link updated successfully");
        },
        onError: (error: Error) => {
          const errorMessage = error?.message || '';
          if (
            errorMessage.includes('already exists')
          ) {
            form.setError('short', {
              message: "Short URL already exists, please choose another one.",
              type: 'manual',
            });
          } else {
            form.setError('root', {
              message: "Update link failed, please try again later.",
              type: 'manual',
            });
          }
        },
      });
    }
  }

  const errorMessage = createMutation.errorMessage || updateMutation.errorMessage;
  const isLoading = createMutation.loading || updateMutation.loading;
  const buttonText = isCreateMode ? 'Create Link' : 'Update Link';

  return (
    <div
      className='container flex flex-col gap-4 h-screen p-4'
    >
      <h1 className='text-2xl font-bold'>
        {isCreateMode ? 'Create Link' : 'Edit Link'}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of the link.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="long"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long URL</FormLabel>
                <FormControl>
                  <Input placeholder="Long URL" {...field} />
                </FormControl>
                <FormDescription>
                  This is the long URL that you want to shorten.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="short"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short URL</FormLabel>
                <FormControl>
                  <Input placeholder="Short URL" {...field} />
                </FormControl>
                <FormDescription>
                  This is the short URL that you want to use.
                  Example: /short-path
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="capitalize text-left"
                >is Active?</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full md:w-60">
                        {field.value === 'active' ? 'Active' : field.value === 'inactive' ? 'Inactive' : 'Select Status'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full md:w-60">
                      <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => field.onChange('active')}
                      >
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => field.onChange('inactive')}
                      >
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormDescription>
                  This is the status of the link.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <div>

              <Button type="submit" variant="outline"
                className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-900 dark:hover:bg-emerald-600 w-3/5 md:w-70 "
                disabled={createMutation.loading || updateMutation.loading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                  buttonText}
              </Button>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
            <Button type="button" variant="destructive" onClick={() => {
              form.reset()
              router.push('/home/link/manage')
            }}>
              Reset
            </Button>
          </div>

        </form>
      </Form>
    </div >
  )
}

export default ManageLinkPage