
import React from 'react';

const Footer = () => {
  return (
    <div className='text-sm text-center py-3 bg-gray-50 fixed bottom-0 w-full left-0 md:left-[250px] md:w-[calc(100%-250px)]'>
      @ Copyright 2024 || Developed By : 
      <a 
        className='text-blue-700 font-bold' 
        target='_blank' 
        rel="noopener noreferrer" 
        href='https://www.linkedin.com/in/harsh-raj-78a3a414b'
      >
        Harsh Raj
      </a>
    </div>
  );
}

export default Footer;
