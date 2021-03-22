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
public class ClientActivityReportForm {
    ClientListFilter clientFilter;
    ClientActivityFilter clientActivityFilter;

    public ClientActivityReportForm() {
    }

    public ClientListFilter getClientFilter() {
        return clientFilter;
    }

    public void setClientFilter(ClientListFilter clientFilter) {
        this.clientFilter = clientFilter;
    }

    public ClientActivityFilter getClientActivityFilter() {
        return clientActivityFilter;
    }

    public void setClientActivityFilter(ClientActivityFilter clientActivityFilter) {
        this.clientActivityFilter = clientActivityFilter;
    }

    public static ClientActivityReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ClientActivityReportForm.class);
    }
}
