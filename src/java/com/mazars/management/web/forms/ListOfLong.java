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
public class ListOfLong {
    private List<Long> list = new LinkedList<Long>();

    public List<Long> getList() {
        return list;
    }

    public void setList(List<Long> list) {
        this.list = list;
    }

    public ListOfLong() {
    }

    public static ListOfLong getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ListOfLong.class);
    }

}
