/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import java.util.Comparator;
import com.mazars.management.web.vo.CarreerItemVO;
import com.mazars.management.web.vo.ClientAndGroupVO;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class ClientAndGroupComparator implements Comparator<ClientAndGroupVO> {
    public int compare(ClientAndGroupVO o1, ClientAndGroupVO o2) {
        String groupName1 = "NO GROUP";
        if(o1.getGroupName() != null) {
            groupName1 = o1.getGroupName();
        }
        String groupName2 = "NO GROUP";
        if(o2.getGroupName() != null) {
            groupName2 = o2.getGroupName();
        }
        int result = groupName1.compareTo(groupName2);
        if(result != 0) {
            return result;
        }
        return o1.getClientName().compareTo(o2.getClientName());
    }
}
