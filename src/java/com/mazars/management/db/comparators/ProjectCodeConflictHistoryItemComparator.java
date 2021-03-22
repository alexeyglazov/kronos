/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class ProjectCodeConflictHistoryItemComparator implements Comparator<ProjectCodeConflictHistoryItem> {
    public int compare(ProjectCodeConflictHistoryItem o1, ProjectCodeConflictHistoryItem o2) {
        if(o1.getModifiedAt() == null && o2.getModifiedAt() == null) {
            return 0;
        } else if(o1.getModifiedAt() == null && o2.getModifiedAt() != null) {
            return -1;
        } else if(o1.getModifiedAt() != null && o2.getModifiedAt() == null) {
            return 1;
        } else {
            return o1.getModifiedAt().compareTo(o2.getModifiedAt());
        }
    }
}
