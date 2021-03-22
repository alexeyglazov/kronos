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
public class ForgotPasswordForm {
    public enum IdentifierType {
        USER_NAME,
        EMAIL
    }
    private ForgotPasswordForm.IdentifierType identifierType;
    private String identifier;

    public ForgotPasswordForm() {
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public IdentifierType getIdentifierType() {
        return identifierType;
    }

    public void setIdentifierType(IdentifierType identifierType) {
        this.identifierType = identifierType;
    }


    public static ForgotPasswordForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ForgotPasswordForm.class);
    }

}
