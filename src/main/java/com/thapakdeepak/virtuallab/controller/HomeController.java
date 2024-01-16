package com.thapakdeepak.virtuallab.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/andgate")
    public String andGate(){
        return "andGate";
    }
    
    @GetMapping("/diode")
    public String pnDiode(){
        return "pnDiode";
    }

    @GetMapping("/gates")
    public String gates(){
       return "logicGates";
    }
}
