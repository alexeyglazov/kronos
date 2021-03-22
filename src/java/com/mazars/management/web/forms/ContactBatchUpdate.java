/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ContactBatchUpdate {
    public enum Action {
        SET_NEWSLETTERS,
        UNSET_NEWSLETTERS,
        SET_REMINDER,
        UNSET_REMINDER
    }
    Action action;
    List<Long> contactIds = new LinkedList<Long>();
    public ContactBatchUpdate() {
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public List<Long> getContactIds() {
        return contactIds;
    }

    public void setContactIds(List<Long> contactIds) {
        this.contactIds = contactIds;
    }

    public static ContactBatchUpdate getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ContactBatchUpdate.class);
    }
}
