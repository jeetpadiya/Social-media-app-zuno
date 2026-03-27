import React, { useContext, useState } from 'react'
import { PostContext } from '../context/PostContext'
 
const AddPost = () => {


    const [text, setText] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const { createPost } = useContext(PostContext)

    const handleFilechnage = (e) => {
      const file = e.target.files[0]
      setImage(file)
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      const created = await createPost(text, image)
      if (created) {
        setText("")
        setImage(null)
        setImagePreview(null)
      }
    }

  return (
     <div className='mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-gray-700 bg-gradient-to-br from-[#13072e] to-[#3f2182] p-6 text-white shadow-xl shadow-black/20'>
        <h2 className='mb-2 text-2xl font-semibold'>Create A Post</h2>
        <p className='mb-6 text-sm text-gray-300'>Share a caption and optionally add an image.</p>
        <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
            <label className='mb-2 block text-sm font-medium'>Caption</label>
            <textarea onChange={(e)=>setText(e.target.value)} className='min-h-32 w-full rounded-xl border border-gray-300 bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400' rows="4" value={text} placeholder='What do you want to share?' />
            </div>
            <div>
            <label className='mb-2 block text-sm font-medium'>Upload image</label>
            <input type="file" onChange={handleFilechnage} accept='image/*' className='w-full rounded-xl border border-gray-300 bg-white p-2 text-black' />
            </div>
            {imagePreview && (
              <div className='overflow-hidden rounded-2xl border border-gray-700'>
                <img src={imagePreview} alt="Preview" className='h-56 w-full object-cover' />
              </div>
            )}
            <div className='flex justify-end'>
              <button type='submit' className='rounded-xl bg-blue-500 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-600'>Submit</button>
            </div>
        </form>
     </div> 
   )
}
 
export default AddPost
 
