package com.example.demo.controller;

import com.example.demo.domain.population.Population;
import com.example.demo.service.PopulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/population")
@RestController
public class PopulationController {

    private final PopulationService populationService;

    @GetMapping
    public ResponseEntity findAll() {

        List<Population> populations = populationService.findAll();

        return new ResponseEntity<>(populations, HttpStatus.OK);
    }

}
