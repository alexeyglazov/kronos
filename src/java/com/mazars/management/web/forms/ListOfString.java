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
public class ListOfString {
    private List<String> list = new LinkedList<String>();

    public List<String> getList() {
        return list;
    }

    public void setList(List<String> list) {
        this.list = list;
    }

    public ListOfString() {
    }

    public static ListOfString getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ListOfString.class);
    }
}
