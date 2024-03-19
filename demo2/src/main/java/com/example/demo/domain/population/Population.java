package com.example.demo.domain.population;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import javax.persistence.*;

@Entity
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table
@IdClass(PopulationPk.class)
public class Population {

    @Id
    @Column(name = "AREA")
    private String area; // 지역

    @Id
    @Column(name = "PRD_DE")
    private int prdDe; // 년월

    @Id
    @Column(name = "GROUPS")
    private String groups; // 그룹

    @Column(name = "DT")
    private String dt; // 실제 값

    @Column(name = "UNIT_NM")
    private String unitNm; // 단위
}