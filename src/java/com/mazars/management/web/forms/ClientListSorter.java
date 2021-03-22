/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.Map;
import java.util.HashMap;

/**
 *
 * @author glazov
 */
public class ClientListSorter {
    public enum Order {
        ASC,
        DESC
    }
    public enum Field {
        ID,
        NAME,
        GROUP,
        COUNTRY
    }
    Field field;
    Order order;

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }


    public ClientListSorter() {
    }

    public static ClientListSorter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ClientListSorter.class);
    }

    public Boolean isIdUsed() {
        if(Field.ID.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isNameUsed() {
        if(Field.NAME.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isGroupUsed() {
        if(Field.GROUP.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isCountryUsed() {
        if(Field.COUNTRY.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isUsed() {
        return field != null;
    }
}
