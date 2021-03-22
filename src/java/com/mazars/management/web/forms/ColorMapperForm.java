/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class ColorMapperForm {
    private Map<Long, String> changedClientColors = new HashMap<Long, String>();

    public ColorMapperForm() {
    }

    public Map<Long, String> getChangedClientColors() {
        return changedClientColors;
    }

    public void setChangedClientColors(Map<Long, String> changedClientColors) {
        this.changedClientColors = changedClientColors;
    }

    public static ColorMapperForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ColorMapperForm.class);
    }
}
