import React from 'react'
import { useRouteError, isRouteErrorResponse } from "react-router-dom"

type Props = {}

export default function ErrorPage({}: Props) {
  const error  = useRouteError();
  let errorMessage: string = '';

  if(isRouteErrorResponse(error)){
    errorMessage = error.error?.message || error.statusText
  } else if (error instanceof Error){
    errorMessage = error.message
  } else if( typeof error === 'string'){
    errorMessage = error
  } else {
    console.error(error)
    console.log('Unknown error')
  }

  return (
    <div id="error-page">
    <h1>Oops!</h1>
    <p>Sorry, an unexpected error has occurred.</p>
    <p>
      <i>{errorMessage}</i>
    </p>
  </div>
  )
}