"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Clock3,
  BadgeIndianRupee,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";

const SERVER = API.replace("/api", "");

export default function TrainingPage() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCourses();
  }, []);


  const fetchCourses = async () => {

    try {

      const res = await fetch(
        `${API}/training/courses`
      );

      const data = await res.json();

      console.log("TRAINING COURSES:", data);

      if(data.success){

        setCourses(
          Array.isArray(data.data)
          ? data.data
          : []
        );

      }


    } catch(err){

      console.error(err);

    } finally {

      setLoading(false);

    }

  };


  return (

<section className="min-h-screen bg-slate-50 py-20">


<div className="mx-auto max-w-7xl px-4">


{/* Heading */}

<div className="mb-14 text-center">

<span className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-700">

Dew Care Hospital Training

</span>


<h1 className="mt-6 text-5xl font-black text-slate-900">

Professional Healthcare Courses

</h1>


<p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">

Join our hospital based training programs and build your healthcare career.

</p>


</div>



{
loading ? (

<div className="py-20 text-center">

<div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>

<p className="mt-5 text-slate-500">
Loading Courses...
</p>

</div>


)

:

courses.length === 0 ? (

<div className="rounded-3xl bg-white p-10 text-center shadow">

<h2 className="text-2xl font-bold">
No Courses Available
</h2>

</div>

)


:

(

<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">


{
courses.map((course)=>(


<div
key={course._id}
className="overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-2"
>


{/* Image */}

<div className="relative h-64">


<Image

src={
course.image
?
(course.image.startsWith("/uploads")
?
SERVER + course.image
:
course.image)
:
"/images/training-default.jpg"
}

alt={course.title || "Course"}

fill

className="object-cover"

/>


{
course.featured && (

<div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold">

⭐ Featured

</div>

)

}


</div>



<div className="p-6">


<h2 className="text-2xl font-black text-slate-900">

{course.title}

</h2>


<p className="mt-3 line-clamp-3 text-slate-600">

{course.shortDescription}

</p>



<div className="mt-6 space-y-3 text-sm text-slate-600">


<div className="flex items-center gap-3">

<Clock3 size={18}
className="text-emerald-600"
/>

<span>
{course.duration}
</span>

</div>


<div className="flex items-center gap-3">

<BadgeIndianRupee
size={18}
className="text-emerald-600"
/>

<span>
₹ {course.fees}
</span>

</div>



<div className="flex items-center gap-3">

<GraduationCap
size={18}
className="text-emerald-600"
/>

<span>
{course.eligibility}
</span>

</div>



<div className="flex items-center gap-3">

<Users
size={18}
className="text-emerald-600"
/>

<span>
{course.seats} Seats
</span>

</div>


</div>




<Link

href={`/training/course/${course.slug}`}

className="mt-7 flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-4 font-bold text-white"

>

View Details

<ArrowRight
size={20}
className="ml-2"
/>

</Link>



</div>


</div>


))

}


</div>

)

}



</div>


</section>

  );

}