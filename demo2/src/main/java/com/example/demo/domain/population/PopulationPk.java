package com.example.demo.domain.population;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
public class PopulationPk implements Serializable {
    private String area; // 지역
    private int prdDe; // 년월
    private String groups; // 그룹
}