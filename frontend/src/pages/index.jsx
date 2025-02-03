import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'

const index = () => {
  const {data: blogData, loading} = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/blogs`,{
        method: 'get',
        credentials: 'include'
    })
    if(loading) return <Loading/>
  return (
    <div className='grid md:grid-cols-3 sm:grid-col-2 grid-col-1 gap-10'>
      {blogData && blogData.blog.length > 0 
      ?
      blogData.blog.map(blog => <BlogCard key={blog._id} props={blog}/>)
      
      :

      <div>Data not found</div>
      }
    </div>
  )
}

export default index