import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>Want to learn Typescript?</h2>
        <p className='text=gray-500 my-2'>Check out these resources on blogg-s</p>
        <Button className='rounded tl-xl rounded-bl-none' gradientDuoTone='purpleToPink'><a href='http://localhost:5173' target='_blank' rel='noopener noreferer'>Blogg-s Typescript</a></Button>
      </div>
      <div className='flex-1 p-7'>
        <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrJD3ZBX3ED6gcI-fF3qqzM3SPujbtVvQ_MA&usqp=CAU'
        />
      </div>
    </div>
  )
}
