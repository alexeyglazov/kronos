/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.comparators.YearMonthDateComparator;
import java.util.Calendar;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class YearMonthDateRange {
    private YearMonthDate start;
    private YearMonthDate end;

    public YearMonthDateRange(YearMonthDate start, YearMonthDate end) {
        this.start = start;
        this.end = end;
    }
    public YearMonthDateRange(Calendar calendarStart, Calendar calendarEnd) {
        if(calendarStart == null) {
            this.start = null;
        } else {
            this.start = new YearMonthDate(calendarStart);
        }
        if(calendarEnd == null) {
            this.end = null;
        } else {
            this.end = new YearMonthDate(calendarEnd);
        }
    }
    public YearMonthDateRange() {
    }

    public YearMonthDate getEnd() {
        return end;
    }

    public void setEnd(YearMonthDate end) {
        this.end = end;
    }

    public YearMonthDate getStart() {
        return start;
    }

    public void setStart(YearMonthDate start) {
        this.start = start;
    }
    public boolean hasYearMonthDate(YearMonthDate date) {
        if((start == null || start.compareTo(date) <= 0) && (end == null || end.compareTo(date) >= 0)) {
            return true;
        }
        return false;
    }
    public static YearMonthDateRange getIntersection(YearMonthDateRange range1, YearMonthDateRange range2) {
        YearMonthDate start = null;
        YearMonthDate end = null;
        YearMonthDate start1 = range1.getStart();
        YearMonthDate end1 = range1.getEnd();
        YearMonthDate start2 = range2.getStart();
        YearMonthDate end2 = range2.getEnd();

        if(end1==null && end2==null) {
            end = null;
            if(start1.compareTo(start2) < 0) {
                start = start2;
            } else {
                start = start1;
            }
        } else if(end1==null && end2!=null) {
            if(start1.compareTo(end2) > 0) {
                start = null;
                end = null;
            } else {
                if(start1.compareTo(start2) < 0) {
                    start = start2;
                } else {
                    start = start1;
                }
                end = end2;
            }
        } else if(end1!=null && end2==null) {
            if(start2.compareTo(end1) > 0) {
                start = null;
                end = null;
            } else {
                if(start2.compareTo(start1) < 0) {
                    start = start1;
                } else {
                    start = start2;
                }
                end = end1;
            }
        } else if(end1!=null && end2!=null) {
            if(start1.compareTo(end2) > 0 || start2.compareTo(end1) > 0) {
                start = null;
                end = null;
            } else {
                if(start1.compareTo(start2) < 0) {
                    start = start2;
                } else {
                    start = start1;
                }
                if(end1.compareTo(end2) < 0) {
                    end = end1;
                } else {
                    end = end2;
                }
            }
        }
        if(start == null && end == null) {
            return null;
        }
        return new YearMonthDateRange(start, end);

    }
    public Boolean isIntersected(YearMonthDateRange range) {
        if(this.getStart().compareTo(range.getStart()) == 0 ) {
            return true;
        } else if(this.getStart().compareTo(range.getStart()) == -1){
            if(this.getEnd() == null) {
                return true;
            } else if(range.getStart().compareTo(this.getEnd()) == 1) {
                return false;
            } else {
                return true;
            }
        } else {
            if(range.getEnd() == null) {
                return true;
            } else if(this.getStart().compareTo(range.getEnd()) == 1) {
                return false;
            } else {
                return true;
            }
        }
    }    
    public static List<YearMonthDateRange> getSubtraction(YearMonthDateRange range1, YearMonthDateRange range2) {
        List<YearMonthDateRange> ranges = new LinkedList<YearMonthDateRange>();
        YearMonthDate start = null;
        YearMonthDate end = null;
        YearMonthDate start1 = range1.getStart();
        YearMonthDate end1 = range1.getEnd();
        YearMonthDate start2 = range2.getStart();
        YearMonthDate end2 = range2.getEnd();

        if(end2 == null) {
            if(start1.compareTo(start2) < 0) {
                ranges.add(new YearMonthDateRange(start1, start2.getShifted(-1)));
            } else {
                //empty
            }
        } else {
            if(start1.compareTo(start2) < 0) {
                if(end1 == null || end1.compareTo(end2) > 0) {
                    ranges.add(new YearMonthDateRange(start1, start2.getShifted(-1)));
                    ranges.add(new YearMonthDateRange(end2.getShifted(1), end1));
                } else if(end1.compareTo(start2) >= 0) {
                    ranges.add(new YearMonthDateRange(start1, start2.getShifted(-1)));
                } else {
                    ranges.add(new YearMonthDateRange(start1, end1));
                }
            } else if(start1.compareTo(start2) >= 0 && start1.compareTo(end2) <= 0) {
                if(end1 == null || end1.compareTo(end2) > 0) {
                    ranges.add(new YearMonthDateRange(end2.getShifted(1), end1));
                } else {
                    //empty
                }
            } else if(start1.compareTo(end2) > 0) {
                ranges.add(new YearMonthDateRange(start1, end1));
            }
        }
        return ranges;

    }
    public static List<YearMonthDateRange> getSubtraction(List<YearMonthDateRange> ranges, YearMonthDateRange range) {
        List<YearMonthDateRange> result = new LinkedList<YearMonthDateRange>();
        for(YearMonthDateRange range1 : ranges) {
            for(YearMonthDateRange rangeTmp : YearMonthDateRange.getSubtraction(range1, range)) {
                result.add(rangeTmp);
            }
        } 
        return result;
    }
    public static List<YearMonthDateRange> getSubtraction(YearMonthDateRange range, List<YearMonthDateRange> ranges) {
        List<YearMonthDateRange> result = new LinkedList<YearMonthDateRange>();
        result.add(range);
        for(YearMonthDateRange rangeTmp : ranges) {
            result = YearMonthDateRange.getSubtraction(result, rangeTmp);           
        }
        return result;
    }
    public static List<YearMonthDateRange> getRangesFromNeighbourDays(List<YearMonthDate> days) {
        List<YearMonthDateRange> ranges = new LinkedList<YearMonthDateRange>();
        Collections.sort(days, new YearMonthDateComparator());
        YearMonthDateRange range = null;
        for(YearMonthDate day : days) {
            if(range == null) {
                range = new YearMonthDateRange(day, day);
                ranges.add(range);
            } else if(day.equals(range.getEnd())) {    
            } else if(day.equals(range.getEnd().getShifted(1))) {
                range.setEnd(day);
            } else {
                range = new YearMonthDateRange(day, day);
                ranges.add(range);
            }        
        }
        return ranges;
    }

    @Override
    public String toString() {
        return "{" + start + ", " + end + '}';
    }
}
