/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.security;
import com.mazars.management.service.ConfigUtils;
import com.mazars.management.service.ObjectUtils;
import com.mazars.management.service.StringUtils;
import javax.crypto.*;
import java.io.*;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
/**
 *
 * @author glazov
 */
public class SecurityUtils {
    private static Cipher encipher;
    private static Cipher decipher;
    private static SecretKey key;

    public static void init(String secretKey) throws ClassNotFoundException, IOException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, ClassNotFoundException {
        readKey(secretKey);
        makeEncipher();
        makeDecipher();
    }

    public static Cipher getDecipher() {
        return decipher;
    }

    public static void setDecipher(Cipher decipher) {
        SecurityUtils.decipher = decipher;
    }

    public static Cipher getEncipher() {
        return encipher;
    }

    public static void setEncipher(Cipher encipher) {
        SecurityUtils.encipher = encipher;
    }

    public static SecretKey getKey() {
        return key;
    }

    public static void setKey(SecretKey key) {
        SecurityUtils.key = key;
    }
    
    public static SecretKey generateKey() throws NoSuchAlgorithmException {
        return KeyGenerator.getInstance("DES").generateKey();
    }
    private static void readKey(String secretKey) throws ClassNotFoundException, IOException {
       key = (SecretKey)ObjectUtils.getObject(SecurityUtils.base64StringToBytes(secretKey));
    }
    private static void makeEncipher() throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException {
        encipher = Cipher.getInstance("DES");
        encipher.init(Cipher.ENCRYPT_MODE, getKey());
    }
    private static void makeDecipher() throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, ClassNotFoundException, IOException {
        decipher = Cipher.getInstance("DES");
        decipher.init(Cipher.DECRYPT_MODE, getKey());
    }   
    public static String bytesToBase64String(byte[] object) {
        return new sun.misc.BASE64Encoder().encode(object);
    }
    public static byte[] base64StringToBytes(String object) throws IOException {
        return new sun.misc.BASE64Decoder().decodeBuffer(object);
    }
    public static byte[] encipher(byte[] object) throws BadPaddingException, IllegalBlockSizeException {
        return getEncipher().doFinal(object);
    }
    public static byte[] decipher(byte[] object) throws BadPaddingException, IllegalBlockSizeException {
        return getDecipher().doFinal(object);
    }
    public static byte[] getHash(byte[] object, byte[] salt) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(object);
        md.update(salt);
        return md.digest();
    }
    public static byte[] getHash(String object, String salt) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        return getHash(object.getBytes("UTF8"), salt.getBytes("UTF8"));
    }
    public static String getHashAsString(String object, String salt) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        return bytesToBase64String(getHash(object, salt));
    }
}
