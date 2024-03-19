package com.example.demo.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;

@SpringBootTest
@ActiveProfiles("dev")
class CommonSchedulerTest {

    @Autowired
    private CommonScheduler commonScheduler;

    @Test
    void protectedAreaScheduler() throws UnsupportedEncodingException, InterruptedException, URISyntaxException, JsonProcessingException {
        commonScheduler.scheduledTask();
    }
}