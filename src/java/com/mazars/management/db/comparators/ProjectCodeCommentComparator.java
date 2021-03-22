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
public class ProjectCodeCommentComparator implements Comparator<ProjectCodeComment> {
    public int compare(ProjectCodeComment o1, ProjectCodeComment o2) {
        return o1.getContent().compareToIgnoreCase(o2.getContent());
    }
}
