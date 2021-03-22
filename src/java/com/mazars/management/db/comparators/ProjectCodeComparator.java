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
public class ProjectCodeComparator implements Comparator<ProjectCode> {
    public int compare(ProjectCode o1, ProjectCode o2) {
        return o1.getCode().compareToIgnoreCase(o2.getCode());
    }
}
