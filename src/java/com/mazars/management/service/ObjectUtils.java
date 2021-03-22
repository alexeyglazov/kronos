/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;

/**
 *
 * @author glazov
 */
public class ObjectUtils {
    public static byte[] getBytes(Object obj) throws IOException {
        if(obj == null) {
            return null;
        }
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutput out = null;
        try {
            out = new ObjectOutputStream(bos);   
            out.writeObject(obj);
            return bos.toByteArray();
        } finally {
            if(out != null) {
                out.close();
            }
            if(bos != null) {
                bos.close();
            }
        }
    }
    public static Object getObject(byte[] bytes) throws IOException, ClassNotFoundException {
        if(bytes == null || bytes.length == 0) {
            return null;
        }
        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        ObjectInput in = null;
        try {
            in = new ObjectInputStream(bis);
            return in.readObject();
        } finally {
            if(bis != null) {
                bis.close();
            }
            if(in != null) {
                in.close();
            }
        }
    }
}
