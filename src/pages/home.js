import React, { useEffect, useState } from 'react'

import axios from 'axios'

import { API } from '../config'

function Home() {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: 0,
  })

  const [upVal, setupVal] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
  })
  // const { name, description, price } = upVal

  const [products, setProducts] = useState(null)

  const { name, description, price } = values

  useEffect(() => {
    getProducts()
  }, [])

  const handleChange = (name) => (event) => {
    // validate = (fieldvalue, name)
    setValues({ ...values, [name]: event.target.value })
    // validate(event.target.value, name)
  }

  const handleupChange = (name) => (event) => {
    // validate = (fieldvalue, name)
    setupVal({ ...upVal, [name]: event.target.value })
    // validate(event.target.value, name)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addProduct()
  }

  const getProducts = async () => {
    const res = await axios.get(`${API}/products`)

    if (res?.data?.data) {
      setProducts(res?.data?.data)
    } else {
      return false
    }
  }

  const addProduct = async () => {
    const res = await axios.post(`${API}/product`, values)

    if (res?.data?.data) {
      getProducts()
      setValues({ name: '', price: '', description: '', id: '' })
    } else {
      setProducts(res?.data?.error)
    }
  }

  const handleProduct = (pro) => {
    setupVal({
      id: pro._id,
      name: pro.name,
      description: pro.description,
      price: pro.price,
    })
  }
  const handleUpdate = (e) => {
    e.preventDefault()
    updateProduct()
  }
  const updateProduct = async () => {
    const res = await axios.patch(`${API}/product/${upVal?.id}`, upVal)

    if (res.data?.data) {
      getProducts()
      clearUpdateForm()
    }
  }

  const handleDelete = async (item) => {
    const res = await axios.delete(`${API}/product/${item?._id}`)

    if (res.data?.data) {
      getProducts()
    }
  }

  const clearUpdateForm = () => {
    setupVal({ name: '', price: '', description: '', id: '' })
  }

  return (
    <div className='App'>
      <nav>
        <div className='container nav__container'>
          <div className='logo'>
            <img src={require('../assets/img/logo.png')} alt='' />
          </div>

          <div className='right'>
            <span className='material-icons-sharp'>menu</span>
          </div>
        </div>
      </nav>

      <section className='nav container'>
        <button className='add'>ADD</button>
        <button className='get'>GET</button>
        <button className='update'>UPDATE</button>
      </section>

      <div className='container main__container'>
        <section className='addItem'>
          <h3>Add Product</h3>
          <form onSubmit={handleSubmit}>
            <div className='login-password'>
              <input
                type='text'
                className='username'
                value={name}
                placeholder='name'
                required
                onChange={handleChange('name')}
              />
            </div>

            <div className='login-password'>
              <textarea
                value={description}
                placeholder='short description'
                maxLength='200'
                cols='20'
                rows='5'
                className='username'
                required
                onChange={handleChange('description')}
              ></textarea>
            </div>

            <div className='login-password'>
              <input
                type='number'
                placeholder='0'
                value={price}
                required
                onChange={handleChange('price')}
              />
            </div>
            <button className='loginBtn'>Add product</button>
          </form>
        </section>
        <section className='getItems'>
          {products ? (
            products?.map((item, ind) => {
              return (
                <div className='item' key={item?._id}>
                  <div className='left' onClick={() => handleProduct(item)}>
                    <span className='num'>{ind + 1}</span>
                    <div className='book'>
                      <span className='name'>{item?.name}</span>{' '}
                      <span className='price'>${item?.price}</span>
                    </div>
                  </div>
                  <span
                    className='material-symbols-outlined delete'
                    onClick={() => handleDelete(item)}
                  >
                    delete
                  </span>
                </div>
              )
            })
          ) : (
            <>
              <h2>No Product For Now</h2>
            </>
          )}
        </section>
        <section className='updateItem'>
          <h3>Update Product</h3>
          <form onSubmit={handleUpdate}>
            <div className='login-password'>
              <input
                type='text'
                className='username'
                placeholder='name'
                value={upVal.name}
                required
                onChange={handleupChange('name')}
              />
            </div>

            <div className='login-password'>
              <textarea
                value={upVal.description}
                placeholder='short description'
                maxLength='200'
                cols='20'
                rows='5'
                className='username'
                required
                onChange={handleupChange('description')}
              ></textarea>
            </div>

            <div className='login-password'>
              <input
                type='number'
                placeholder='0'
                value={upVal.price}
                required
                onChange={handleupChange('price')}
              />
            </div>

            <div className='btn-group'>
              <button className='loginBtn' onClick={clearUpdateForm}>
                Clear
              </button>
              <button className='loginBtn'>Update</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Home
