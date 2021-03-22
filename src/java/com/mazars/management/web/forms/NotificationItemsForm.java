/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.NotificationItem.Event;
import java.util.List;
import java.util.LinkedList;
import com.mazars.management.db.domain.NotificationItem;
/**
 *
 * @author glazov
 */
public class NotificationItemsForm {
    public static class Item {

        private Long id;
        private Long employeeId;
        private NotificationItem.Event event;

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public Event getEvent() {
            return event;
        }

        public void setEvent(Event event) {
            this.event = event;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }
    private List<Item> items = new LinkedList<Item>();

    public NotificationItemsForm() {
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public static NotificationItemsForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, NotificationItemsForm.class);
    }
}
