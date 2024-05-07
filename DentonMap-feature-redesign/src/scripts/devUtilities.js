/**
 * Developer utilities to aid in debugging
 * 
 * Alexander Evans
 * April 22, 2024
 */

import { googleSignin } from "./login"

/**
 * Automatically logs the user in 
 * Used to auto log in
 */
export const automaticLogIn = () =>{
    googleSignin();    
}