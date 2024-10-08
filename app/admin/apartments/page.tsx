"use client"

import AdminNavigation from '@/components/admin/AdminLayout'
import { Upload } from 'lucide-react'
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'react-toastify'

interface House {
  id: number
  title: string
  field: string
  description: string
  image: string
  category: string
}

export default function AdminSuiteManagement() {
  const [title, setTitle] = useState<string>("")
  const [number, setNumber] = useState<number>(0)
  const [field, setField] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [houses, setHouses] = useState<House[]>([])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImage(file)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (!title || !field || !description || !imagePreview || !category) {
      toast.warning("Please fill all fields and upload an image.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          field,
          description,
          image: imagePreview,
          category,
        }),
      })

      if (response.ok) {
        toast.success("Suite added successfully")
        fetchHouses() // Refresh the house list
        // Reset form fields
        setTitle("")
        setField("")
        setDescription("")
        setCategory("")
        setImagePreview(null)
        setImage(null)
      } else {
        const errorData = await response.json()
        toast.warning(errorData.error || "Error creating a suite")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchHouses = async () => {
    try {
      const res = await fetch("/api/apartments")
      const data = await res.json()

      setHouses(data.houses)
      setNumber(data.houses.length === 0 ? 1 : data.houses.length + 1)
    } catch (error: unknown) {
      console.log(error)
      toast.error("Failed to fetch houses")
    }
  }

  useEffect(() => {
    fetchHouses()
  }, [])

  return (
    <AdminNavigation>
      <div className="p-4 min-h-screen bg-base-200">
        <h1 className="text-4xl font-bold mb-6 text-primary">Deby Hotel</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="card bg-base-100 shadow-xl lg:w-1/3">
            <div className="card-body">
              <h2 className="card-title text-center text-2xl mb-4">Add a Suite</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label htmlFor='image' className="label cursor-pointer justify-center">
                    <span className="label-text sr-only">Upload Image</span>
                    <div className="w-32 h-32 rounded-full bg-base-300 flex items-center justify-center text-primary overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload size={40} />
                      )}
                    </div>
                  </label>
                  <input type="file" className="hidden" id="image" onChange={handleImageChange} accept="image/*" />
                </div>
                
                <div className="form-control">
                  <label className="label" htmlFor="title">
                    <span className="label-text">House Title</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered input-success w-full"
                    placeholder="Enter house title"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label" htmlFor="field">
                    <span className="label-text">House Field</span>
                  </label>
                  <input
                    type="text"
                    id="field"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="input input-bordered input-success w-full"
                    placeholder="Enter house field"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label" htmlFor="category">
                    <span className="label-text">Category</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input input-bordered input-success w-full"
                    placeholder="Enter suite category"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label" htmlFor="description">
                    <span className="label-text">House Description</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered textarea-success h-24"
                    placeholder="Enter house description"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-success btn-block" disabled={loading}>
                  {loading && <span className="loading loading-spinner loading-xs mr-2"></span>}
                  Add Suite
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Available Suites</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {houses.map((house) => (
                    <tr key={house.id}>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={house.image} alt={house.title} />
                          </div>
                        </div>
                      </td>
                      <td>{house.title}</td>
                      <td>{house.category}</td>
                      <td>{house.description.length > 50 ? `${house.description.substring(0, 50)}...` : house.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminNavigation>
  )
}