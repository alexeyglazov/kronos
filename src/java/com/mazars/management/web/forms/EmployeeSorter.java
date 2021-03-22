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
public class EmployeeSorter {
    public enum Order {
        ASC,
        DESC
    }
    public enum Field {
        ID,
        FIRST_NAME,
        LAST_NAME,
        USER_NAME
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


    public EmployeeSorter() {
    }

    public static EmployeeSorter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeeSorter.class);
    }

    public Boolean isIdUsed() {
        if(Field.ID.equals(field)) {
            return true;
        } else {
            return false;
        }
    }

    public Boolean isFirstNameUsed() {
        if(Field.FIRST_NAME.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isLastNameUsed() {
        if(Field.LAST_NAME.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isUserNameUsed() {
        if(Field.USER_NAME.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isUsed() {
        return field != null;
    }
}
