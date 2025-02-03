// clicl on Blog (homepage then it renders)

import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteName';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { deleteData } from '@/helpers/handleDelete';
import Loading from '@/components/Loading';
import { MdDeleteOutline } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import moment from 'moment';

const BlogDetails = () => {

  const [refreshData, setRefreshData] = useState(false)
  const {data: blogData, loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-all`,{
      method: 'get',
      credentials: 'include'
  }, [refreshData])
//   const handleDelete = (id) => {
//     const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
//     if (response) {
//         setRefreshData(!refreshData)
//         showToast('success', 'Data deleted.')
//     } else {
//         showToast('error', 'Data not deleted.')
//     }
// }
const handleDelete = async (id) => {
  try {
      const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`);
      if (response) {
          setRefreshData((prev) => !prev); // Toggle the state to trigger a re-fetch
          showToast('success', 'Blog deleted.');
      } else {
          showToast('error', 'Data not deleted.');
      }
  } catch (error) {
      showToast('error', 'An error occurred.');
      console.error(error);
  }
};


  if(loading) return <Loading/>

  return (
    <div>
      <Card>
      <CardHeader>
        <div>
          <Button asChild>
            <Link to={RouteBlogAdd}>
            Add Blog
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
      <Table>

  <TableHeader>
    <TableRow>
      <TableHead>Author</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Slug</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
   {blogData && blogData.blog.length > 0 ? 
   blogData.blog.map(blog =>
    <TableRow key = {blog._id}>
    <TableCell>{blog?.author?.name}</TableCell>
    <TableCell>{blog?.category?.name}</TableCell>
    <TableCell>{blog?.title}</TableCell>
    <TableCell>{blog?.slug}</TableCell>
    <TableCell>{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>

   
    <TableCell className="flex gap-2">
        <Button variant="outline" className="bg-white hover:bg-violet-700 hover:text-white" asChild >
            <Link to={RouteBlogEdit(blog._id)}>
            <BiEdit />
            </Link>
        </Button >
        <Button onClick={()=> handleDelete(blog._id)} variant="outline" className="bg-white hover:bg-violet-700 hover:text-white"  >
            <MdDeleteOutline />
        </Button>
    </TableCell>
   </TableRow>
   )
 
    :
  <TableRow>
    <TableCell colspan="3">Data not found</TableCell>
  </TableRow>
}
  </TableBody>
</Table>

      </CardContent>
    </Card>
  </div>
  )
}

export default BlogDetails