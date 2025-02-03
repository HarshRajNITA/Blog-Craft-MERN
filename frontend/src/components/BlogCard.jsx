import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";
const BlogCard = ({ props }) => {
  return (
    <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
      <Card className="pt-5 ">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center gap-2">
              <Avatar>
                <AvatarImage
                  className="h-10 w-10 rounded-full"
                  src={props.author.avatar || usericon}
                />
              </Avatar>
              <span>{props.author.name}</span>
            </div>
            {props.author.role === "admin" && (
              <Badge variant="outline" className="bg-violet-500">
                Admin
              </Badge>
            )}
          </div>

          <div class="my-2 flex justify-center items-center">
            <img
              src={props.featuredImage}
              class="w-[300px] h-[200px] rounded object-cover"
              alt={props.title}
            />
          </div>
          <div>
            <p className="flex items-center gap-2 mb-2">
              <FaRegCalendarAlt />
              <span>{moment(props.createdAt).format("DD-MM-YYYY")}</span>
            </p>
            <h2 className="text-2xl font-bold line-clamp-2">{props.title}</h2>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;

// import React from 'react'
// import { Card, CardContent } from './ui/card'
// import { Badge } from 'lucide-react'
// import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
// import { FaCalendarAlt } from "react-icons/fa";
// import usericon from '@/assets/images/user.png'

// const BlogCard = ({props}) => {

//   return (
//     <Card className="pt-5">
//         <CardContent>
//                 <div className='flex items-center justify-between'>
//                     <div className='flex justify-between items-center'>
//                         <Avatar>
//                             <AvatarImage className='h-10 w-10 rounded-full' src={props.author.avatar || usericon}/>
//                         </Avatar>
//                         <span>{props.author.name}</span>
//                     </div>
//                     { props.author.role ==='admin' &&
//                         <Badge variant="outline" className='bg-violet-500'>Admin HU BHAI</Badge>
//                     }
//                 </div>
//                 {/* featured image and title and date */}
//                 <div>

//                 </div>
//                 <div>
//                     <p>
//                     <FaCalendarAlt />
//                     <span>date</span>
//                     </p>
//                     <h2 className='text-2xl font-bold line-clamp-2'>Your title</h2>
//                 </div>

//         </CardContent>
//     </Card>
//   )
// }

// export default BlogCard
