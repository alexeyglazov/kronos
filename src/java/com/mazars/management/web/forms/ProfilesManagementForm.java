/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.Employee.Profile;
import java.util.List;
import java.util.LinkedList;
import com.mazars.management.db.domain.*;

/**
 *
 * @author glazov
 */
public class ProfilesManagementForm {
    public static class EmployeeProfile {
        private Long id;
        private Employee.Profile profile;

        public EmployeeProfile() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Profile getProfile() {
            return profile;
        }

        public void setProfile(Profile profile) {
            this.profile = profile;
        }
    }
    private List<EmployeeProfile> employeeProfiles = new LinkedList<EmployeeProfile>();

    public ProfilesManagementForm() {
    }

    public List<EmployeeProfile> getEmployeeProfiles() {
        return employeeProfiles;
    }

    public void setEmployeeProfiles(List<EmployeeProfile> employeeProfiles) {
        this.employeeProfiles = employeeProfiles;
    }


    public static ProfilesManagementForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProfilesManagementForm.class);
    }
}
