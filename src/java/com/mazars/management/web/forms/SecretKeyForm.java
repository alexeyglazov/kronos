/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class SecretKeyForm {
    private String userName;
    private String secretKey;

    public SecretKeyForm() {
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    
    public static SecretKeyForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, SecretKeyForm.class);
    }

}
