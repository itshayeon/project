package com.example.demo.service;

import com.example.demo.domain.population.Population;
import com.example.demo.domain.population.PopulationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PopulationService {

    private final PopulationRepository populationRepository;

    public List<Population> findAll() {
       return populationRepository.findAll();
    }
}
