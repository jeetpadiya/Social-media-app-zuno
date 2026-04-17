import { useContext, useState } from 'react'
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
     <div className='glass-panel mx-auto mt-8 w-full max-w-3xl rounded-[32px] p-6 text-white shadow-xl shadow-black/20'>
        <p className='text-xs uppercase tracking-[0.32em] text-slate-400'>New drop</p>
        <h2 className='mb-2 mt-2 text-3xl font-black tracking-tight'>Create a post</h2>
        <p className='mb-6 text-sm leading-6 text-slate-300'>Share a caption and optionally add an image. The new layout gives the form stronger hierarchy and a more premium surface.</p>
        <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
            <label className='mb-2 block text-sm font-medium text-slate-200'>Caption</label>
            <textarea onChange={(e)=>setText(e.target.value)} className='min-h-36 w-full rounded-[24px] border border-white/10 bg-[#f8fafc] p-4 text-black focus:outline-none focus:ring-2 focus:ring-sky-300' rows="4" value={text} placeholder='What do you want to share?' />
            </div>
            <div>
            <label className='mb-2 block text-sm font-medium text-slate-200'>Upload image</label>
            <input type="file" onChange={handleFilechnage} accept='image/*' className='w-full rounded-[20px] border border-white/10 bg-white/6 p-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900' />
            </div>
            {imagePreview && (
              <div className='overflow-hidden rounded-[24px] border border-white/10'>
                <img src={imagePreview} alt="Preview" className='h-56 w-full object-cover' />
              </div>
            )}
            <div className='flex justify-end'>
              <button type='submit' className='accent-button rounded-full px-6 py-3 font-semibold text-white transition'>Publish Post</button>
            </div>
        </form>
     </div> 
   )
}
 
export default AddPost
 
