/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class CodeListReportForm {

    public CodeListReportForm() {
    }
 
    public static CodeListReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CodeListReportForm.class);
    }
}
