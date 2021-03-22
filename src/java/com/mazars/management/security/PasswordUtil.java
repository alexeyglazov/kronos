/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.security;

import com.mazars.management.db.util.*;

/**
 *
 * @author Glazov
 */
public class PasswordUtil {
    public static String generate() {
        String password = "";
        Character[] allowedChars = {
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        };
        Character[] allowedDigits = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
        for(int i = 0; i < 8; i++) {
            if(Math.random() < 0.8) {
                int index = (int)Math.floor(allowedChars.length * Math.random());
                password += allowedChars[index];
            } else {
                int index = (int)Math.floor(allowedDigits.length * Math.random());
                password += allowedDigits[index];
            }
        }
        return password;
    }
}
