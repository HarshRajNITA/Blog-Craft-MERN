import Comment from "@/components/Comment";
import CommentCount from "@/components/CommentCount";
import CommentList from "@/components/CommentList";
import LikeCount from "@/components/LikeCount";
import Loading from "@/components/Loading";
import RelatedBlog from "@/components/RelatedBlog";
import { Avatar } from "@/components/ui/avatar";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { AvatarImage } from "@radix-ui/react-avatar";
import { decode } from "entities";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";

const SingleBlogDetails = () => {
  const { blog, category } = useParams();

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`,
    {
      method: "get",
      credentials: "include",
    },
    [blog, category]
  );

  if (loading) return <Loading />;

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
      {/* single blog details section ie 70 % */}
      {data && data.blog && (
        <>
          <div className="border rounded md:w-[70%] w-full p-5">
            <h1 className="text-2xl font-bold mb-5">{data.blog.title}</h1>
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-5">
                <Avatar>
                  <AvatarImage src={data.blog.author.avatar} />
                </Avatar>
                <div>
                  <p className="font-bold">{data.blog.author.name}</p>
                  <p className="text-xs">
                    Date: {moment(data.blog.createdAt).format("DD-MM-YYYY")}
                  </p>
                  <p className="text-xs">
                    Time: {moment(data.blog.createdAt).format("hh:mm A")}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center gap-5">
                <LikeCount props={{ blogid: data.blog._id }} />
                <CommentCount props={{ blogid: data.blog._id }} />
              </div>
            </div>
            <div className="my-5 flex justify-center items-center">
              <img
                className="max-h-[400px] max-w-full rounded object-contain"
                src={data.blog.featuredImage}
                alt="Blog Featured"
              />
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: decode(data.blog.blogContent) || "",
              }}
            ></div>
            <div className="border mt-5 pt-5">
              <Comment props={{ blogid: data.blog._id }} />
            </div>
          </div>
        </>
      )}
      {/* related blog section ie 30 % */}
      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog props={{ category: category, currentBlog: blog }} />
      </div>
    </div>
  );
};

export default SingleBlogDetails;
