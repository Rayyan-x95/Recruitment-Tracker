package com.rectracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RecruitmentTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecruitmentTrackerApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("  Recruitment Tracker Web Application Started Successfully!");
        System.out.println("  Access URL: http://localhost:8080");
        System.out.println("=======================================================\n");
    }
}
