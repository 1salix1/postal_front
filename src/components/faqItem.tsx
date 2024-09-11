import React, { useState } from 'react'
type faqProps = {
  question: string
  answer: string
}
const FaqItem = ({ question, answer }: faqProps) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={open ? 'faq active' : 'faq'}>
      <h3
        onClick={() => {
          setOpen(!open)
        }}
        className='faq__title'
      >
        {question}
      </h3>
      <p className='faq__text'>{answer}</p>
      <button
        onClick={() => {
          setOpen(!open)
        }}
        className='faq__toggle'
      >
        {open ? <i className='fas fa-times'></i> : <i className='fas fa-chevron-down'></i>}
      </button>
    </div>
  )
}
export default FaqItem
