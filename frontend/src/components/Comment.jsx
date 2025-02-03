import React, { useState } from 'react'
import { FaComments } from "react-icons/fa";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { RouteSignIn } from '@/helpers/RouteName';
import CommentList from './CommentList';
import { Link } from 'react-router-dom';

const Comment = ({ props }) => {
    const [newComment, setNewComment] = useState()
    const user = useSelector((state) => state.user)
    const formSchema = z.object({
        comment: z.string().min(3, 'Comment must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    async function onSubmit(values) {
        try {
            const newValues = { ...values, blogid: props.blogid, user: user.user._id }
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/comment/add`, {
                method: 'post',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(newValues)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            setNewComment(data.comment)
            form.reset()
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold pl-2'> <FaComments className='text-violet-500' /> Comment</h4>

            {user && user.isLoggedIn
                ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  >
                        <div className='mb-3 ml-2 mr-2'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel></FormLabel>
                                        <FormControl>
                                            <Textarea  placeholder="Type your comment..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button className="ml-2" type="submit" >Submit</Button>
                    </form>
                </Form>
                :
               <div className='pl-2 pt-1'> 
                     <Button asChild >
                    <Link to={RouteSignIn}>Sign In </Link>
                </Button>

               </div>
                
               
            }

            <div className='mt-5'>
                <CommentList props={{ blogid: props.blogid, newComment }} />
            </div>

        </div>
    )
}

export default Comment