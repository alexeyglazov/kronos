/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
/**
 *
 * @author Glazov
 */
public class TaskTypeComparator implements Comparator<TaskType> {
    public int compare(TaskType o1, TaskType o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
}
