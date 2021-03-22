/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.service.LeavesBalanceCalculator;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class LeavesBalanceCalculatorResult {
    String employeeUserName;
    String employeeFirstName;
    String employeeLastName;
    YearMonthDate date;
    List<LeavesBalanceCalculator.Stage> stages = new LinkedList<LeavesBalanceCalculator.Stage>();
    List<LeavesBalanceCalculator.SpentLeaveItem> spentLeaveItems = new LinkedList<LeavesBalanceCalculator.SpentLeaveItem>();

    public LeavesBalanceCalculatorResult() {
    }

    public LeavesBalanceCalculatorResult(LeavesBalanceCalculator leavesBalanceCalculator) {
        this.employeeUserName = leavesBalanceCalculator.getEmployee().getUserName();
        this.employeeFirstName = leavesBalanceCalculator.getEmployee().getFirstName();
        this.employeeLastName = leavesBalanceCalculator.getEmployee().getLastName();
        this.date = leavesBalanceCalculator.getDate();
        for(LeavesBalanceCalculator.Stage stage : leavesBalanceCalculator.getStages()) {
            stages.add(stage);
        }
        for(LeavesBalanceCalculator.SpentLeaveItem spentLeaveItem : leavesBalanceCalculator.getSpentLeaveItems()) {
            spentLeaveItems.add(spentLeaveItem);
        }
    }
    
}
