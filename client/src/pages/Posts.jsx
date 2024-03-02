import {React, useEffect,useState} from 'react'
import {useParams, Link} from 'react-router-dom';
import {Spinner, Button} from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import Comments from '../components/Comments';


export default function Posts() {
    const {postSlug} = useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null);

    useEffect(() => {
        try{
            setLoading(true)
            const fetchPost = async () => {
                const res = await fetch(`http://localhost:3000/api/post/getposts?slug=${postSlug}`)
                const data = await res.json();
                if(!res.ok){
                    setError(true);
                    setLoading(false);
                    console.log(data.message);
                    return;
                }
                if(res.ok){
                    setPost(data.posts[0])
                    setLoading(false);
                    setError(false);
                }
            }
            fetchPost();
        }catch(error) {
            setError(true);
            setLoading(false);
            console.log(error)
        }
    },[postSlug])

    if(loading) return (
    <div className='flex justify-center items-center min-h-screen'>
        <Spinner sixe='xl'/>
    </div>
    )
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
        <Button color='gray' pill size='xs'>{post && post.category}</Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins read</span>
      </div>
      <div className='p-3 w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>
      
      </div>
      <div className='max-w-4xl mx-auto w-full'>
       <CallToAction/>
      </div>
      <Comments postId={post._id}/>
    </main>
  )
}


