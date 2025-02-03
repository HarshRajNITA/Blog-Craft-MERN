import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";
import usericon from "@/assets/images/user.png";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state

  const {
    data: userData,
    loading,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/user/get-user/${user.user._id}`,
    { method: "get", credentials: "include" }
  );

  const dispatch = useDispatch();

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters!"),
    email: z.string().email(),
    bio: z.string().min(3, "Bio must be at least 3 characters!"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio,
      });
    }
  }, [userData]);

  async function onSubmit(values) {
    setIsSubmitting(true); // Show loader
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-user/${userData.user._id}`,
        {
          method: "put",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
      } else {
        dispatch(setUser(data.user));
        showToast("success", data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  }

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setPreview(preview);
  };

  if (loading || isSubmitting) return <Loading />;

  return (
    <Card className="max-w-screen-md mx-auto py-">
      <CardContent>
        <div className="flex justify-center items-center mt-10">
          <Dropzone onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="h-36 w-36 relative group">
                  <AvatarImage
                    className="rounded-full object-cover h-36 w-36"
                    src={
                      filePreview
                        ? filePreview
                        : userData?.user?.avatar || usericon ||
                          "https://robohash.org/default-avatar.png"
                    }
                  />
                  <div
                    className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center
                     bg-black bg-opacity-20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer"
                  >
                    <IoCameraOutline color="#7c3aed" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Your Bio!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Profile;



// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { getEnv } from "@/helpers/getEnv";
// import { showToast } from "@/helpers/showToast";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { Textarea } from "@/components/ui/textarea";
// import { useFetch } from "@/hooks/useFetch";
// import Loading from "@/components/Loading";
// import { IoCameraOutline } from "react-icons/io5";
// import Dropzone from "react-dropzone";
// import { setUser } from "@/redux/user/user.slice";
// import usericon from '@/assets/images/user.png'

// const Profile = () => {
//   const user = useSelector((state) => state.user);
//   const [filePreview, setPreview] = useState();
//   const [file, setFile] = useState();

//   const {
//     data: userData,
//     loading,
//     error,
//   } = useFetch(
//     `${getEnv("VITE_API_BASE_URL")}/user/get-user/${user.user._id}`,
//     { method: "get", credentials: "include" }
//   );
  
//   const dispatch = useDispatch();

//   const formSchema = z.object({
//     name: z.string().min(3, "Name must be min 3 characters!"),
//     email: z.string().email(),
//     bio: z.string().min(3, "bio must be atleast 3 characters!"),
//   });

//   //setting default values for email and password
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       bio: "",
//       password: "",
//     },
//   });

//   useEffect(() => {
//     if (userData && userData.success) {
//       form.reset({
//         name: userData.user.name,
//         email: userData.user.email,
//         bio: userData.user.bio,
//       });
//     }
//   }, [userData]);

//   //form handler
//   async function onSubmit(values) {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("data", JSON.stringify(values));
//       const response = await fetch(
//         `${getEnv("VITE_API_BASE_URL")}/user/update-user/${userData.user._id}`,
//         {
//           method: "put",
//           credentials: "include",
//           body: formData,
//         }
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         return showToast("error", data.message);
//       }
//       dispatch(setUser(data.user));
//       showToast("success", data.message);
//     } catch (error) {
//       showToast("error", error.message);
//     }
//   }

//   const handleFileSelection = (files) => {
//     const file = files[0];
//     const preview = URL.createObjectURL(file);
//     setFile(file);
//     setPreview(preview);
//   };

//   if (loading) return <Loading />;

//   return (
//     <Card className="max-w-screen-md mx-auto py-">
//       <CardContent>
//         <div className="flex justify-center items-center mt-10">
//           <Dropzone
//             onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
//           >
//             {({ getRootProps, getInputProps }) => (
//               <div {...getRootProps()}>
//                 <input {...getInputProps()} />
//                 <Avatar className="h-36 w-36 relative group">
//                   <AvatarImage
//                     className="rounded-full object-cover h-36 w-36"
//                     src={
//                       filePreview
//                         ? filePreview
//                         : userData?.user?.avatar || usericon ||
//                           "https://robohash.org/default-avatar.png"
//                     }
//                   />
//                   <div
//                     className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center
//                      bg-black bg-opacity-20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer"
//                   >
//                     <IoCameraOutline color="#7c3aed" />
//                   </div>
//                 </Avatar>
//               </div>
//             )}
//           </Dropzone>
//         </div>
//         <div>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <div className="mb-3">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter your Name" {...field} />
//                       </FormControl>
//                       <FormDescription></FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-3">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter your email" {...field} />
//                       </FormControl>
//                       <FormDescription></FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-3">
//                 <FormField
//                   control={form.control}
//                   name="bio"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Bio</FormLabel>
//                       <FormControl>
//                         <Textarea placeholder="Enter Your Bio!" {...field} />
//                       </FormControl>
//                       <FormDescription></FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-3">
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="Enter your Password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormDescription></FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <Button type="submit" className="w-full">
//                 {" "}
//                 Save Changes
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default Profile;
