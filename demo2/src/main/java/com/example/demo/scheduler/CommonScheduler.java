package com.example.demo.scheduler;

import com.example.demo.domain.population.Population;
import com.example.demo.domain.population.PopulationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CommonScheduler {

    private final PopulationRepository populationRepository;

    @Scheduled(cron = "0 0 0 1 * *") // 매월 1일 0시마다 실행
    public void scheduledTask() throws JsonProcessingException {
        // 첫 번째 API 호출
        callFirstApi();

        // 두 번째 API 호출
        callSecondApi();

        // 세 번째 API 호출
        callThirdApi();
    }

    public void callFirstApi() throws JsonProcessingException {
        String populationList = WebClient.create().get()
            .uri("https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=MzM2OGU5ZTNjZTYxYjUxZTM3NGYxNDFhZjQyN2YxZDU=&itmId=T20+T21+T22+&objL1=31+&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=M&newEstPrdCnt=14&outputFields=ORG_ID+TBL_ID+TBL_NM+OBJ_ID+OBJ_NM+OBJ_NM_ENG+NM+NM_ENG+ITM_ID+ITM_NM+ITM_NM_ENG+UNIT_NM+UNIT_NM_ENG+PRD_SE+PRD_DE+&orgId=101&tblId=DT_1B040A3")
            .retrieve()
            .bodyToMono(String.class)
            .block(); // 동기적으로 결과를 받아옴

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(populationList);

        List<Population> dataList = new ArrayList<>();

        for (JsonNode node : jsonNode) {
            String area = node.path("C1_NM").asText();
            String groups = node.path("ITM_NM").asText();
            String dt = node.path("DT").asText();
            int prdDe = Integer.parseInt(node.path("PRD_DE").asText());
            String unitNm = node.path("UNIT_NM").asText();

            Population dataMap = new Population();
            dataMap.setArea(area);
            dataMap.setGroups(groups);
            dataMap.setDt(dt);
            dataMap.setPrdDe(prdDe);
            dataMap.setUnitNm(unitNm);

            dataList.add(dataMap);
        }
        // 엔티티 리스트 저장
        populationRepository.saveAll(dataList);
    }

    public void callSecondApi() throws JsonProcessingException {
        String populationList = WebClient.create().get()
                .uri("https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=MzM2OGU5ZTNjZTYxYjUxZTM3NGYxNDFhZjQyN2YxZDU=&itmId=T10+T20+T30+T40+T50+T80+T90+&objL1=26+&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=M&newEstPrdCnt=13&outputFields=ORG_ID+TBL_ID+TBL_NM+OBJ_ID+OBJ_NM+OBJ_NM_ENG+NM+NM_ENG+ITM_ID+ITM_NM+ITM_NM_ENG+UNIT_NM+UNIT_NM_ENG+PRD_SE+PRD_DE+&orgId=101&tblId=DT_1DA7004S")
                .retrieve()
                .bodyToMono(String.class)
                .block(); // 동기적으로 결과를 받아옴

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(populationList);

        List<Population> dataList = new ArrayList<>();

        for (JsonNode node : jsonNode) {
            String area = node.path("C1_NM").asText();
            String groups = node.path("ITM_NM").asText();
            String dt = node.path("DT").asText();
            int date = Integer.parseInt(node.path("PRD_DE").asText());
            String unitNm = node.path("UNIT_NM").asText();

            Population dataMap = new Population();
            dataMap.setArea(area);
            dataMap.setGroups(groups);
            dataMap.setDt(dt);
            dataMap.setPrdDe(date);
            dataMap.setUnitNm(unitNm);

            dataList.add(dataMap);
        }
        // 엔티티 리스트 저장
        populationRepository.saveAll(dataList);
    }

    public void callThirdApi() throws JsonProcessingException {
        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(-1)) // to unlimited memory size
                .build();

        WebClient webClient = WebClient.builder()
                .exchangeStrategies(exchangeStrategies) // set exchange strategies
                .build();

        String populationList = webClient.get()
                .uri("https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=MzM2OGU5ZTNjZTYxYjUxZTM3NGYxNDFhZjQyN2YxZDU=&itmId=T2+T3+T4+&objL1=31+&objL2=5+10+15+20+25+30+35+40+45+50+55+60+65+70+75+80+85+90+95+100+105+&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=M&newEstPrdCnt=14&outputFields=ORG_ID+TBL_ID+TBL_NM+OBJ_ID+OBJ_NM+OBJ_NM_ENG+NM+NM_ENG+ITM_ID+ITM_NM+ITM_NM_ENG+UNIT_NM+UNIT_NM_ENG+PRD_SE+PRD_DE+&orgId=101&tblId=DT_1B04005N")
                .retrieve()
                .bodyToMono(String.class)
                .block(); // 동기적으로 결과를 받아옴

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(populationList);

        List<Population> dataList = new ArrayList<>();

        for (JsonNode node : jsonNode) {
            String area = node.path("C1_NM").asText();
            String sex = node.path("ITM_NM").asText();
            String dt = node.path("DT").asText();
            int prdDe = Integer.parseInt(node.path("PRD_DE").asText());
            String age = node.path("C2_NM").asText();
            String unitNm = node.path("UNIT_NM").asText();

            Population dataMap = new Population();
            dataMap.setGroups(sex + age);
            dataMap.setArea(area);
            dataMap.setDt(dt);
            dataMap.setPrdDe(prdDe);
            dataMap.setUnitNm(unitNm);

            dataList.add(dataMap);
        }
        // 엔티티 리스트 저장
        populationRepository.saveAll(dataList);
    }
}
