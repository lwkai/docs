"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[904],{94648:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},98395:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},28726:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},16020:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},69472:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},78615:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},19225:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},9806:function(I,e,a){a.r(e),a.d(e,{demos:function(){return d}});var n=a(75271),d={}},76863:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[{value:"\u81EA\u5B9A\u4E49\u6CE8\u89E3 + \u62E6\u622A\u5668 \u5B9E\u73B0 \u767B\u5F55/\u6CE8\u518C \u7B49\u5173\u952E\u4F4D\u7F6E\u7684\u5B89\u5168\u4EE4\u724C\u529F\u80FD\uFF0C",paraId:0,tocIndex:0},{value:"\u4E1A\u52A1\u98CE\u63A7 / \u9632\u722C\u9632\u649E\u5E93\uFF08\u4EBA\u673A\u6311\u6218 / \u4EBA\u673A\u6821\u9A8C / \u5B89\u5168\u4EE4\u724C / \u6311\u6218\u54CD\u5E94\u673A\u5236 / \u8BBE\u5907\u6307\u7EB9 \uFF09",paraId:1,tocIndex:0},{value:"\u8981\u5B9E\u73B0\u53EA\u62E6\u622A\u6307\u5B9A\u63A5\u53E3\uFF08\u5982\u6CE8\u518C\u3001\u767B\u5F55\uFF09\uFF0C\u6700\u4F18\u96C5\u4E14\u7B26\u5408 Spring Boot \u4E60\u60EF\u7684\u505A\u6CD5\u662F\u4F7F\u7528 ",paraId:2,tocIndex:0},{value:"\u81EA\u5B9A\u4E49\u6CE8\u89E3 + \u62E6\u622A\u5668",paraId:2,tocIndex:0},{value:"\u3002",paraId:2,tocIndex:0},{value:"\u8FD9\u6837\u4F60\u5C31\u4E0D\u9700\u8981\u5728\u62E6\u622A\u5668\u7684\u914D\u7F6E\u7C7B\u91CC\u5199\u6B7B\u4E00\u957F\u4E32\u7684 URL \u8DEF\u5F84\uFF0C\u800C\u662F\u76F4\u63A5\u5728 Controller \u7684\u65B9\u6CD5\u4E0A\u201C\u70B9\u77F3\u6210\u91D1\u201D\u3002",paraId:3,tocIndex:0},{value:"@RiskCheck",paraId:4},{value:"\u521B\u5EFA\u4E00\u4E2A\u8FD0\u884C\u65F6\u6CE8\u89E3\uFF0C\u7528\u6765\u6807\u8BB0\u9700\u8981\u8FDB\u884C RiskToken \u6821\u9A8C\u7684\u65B9\u6CD5\u3002",paraId:5,tocIndex:2},{value:`@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RiskCheck {
    // \u53EF\u4EE5\u6269\u5C55\u53C2\u6570\uFF0C\u6BD4\u5982\uFF1A\u6821\u9A8C\u5F3A\u5EA6\u7B49\u7EA7
    boolean required() default true;
}
`,paraId:6,tocIndex:2},{value:"\u5728\u62E6\u622A\u5668\u4E2D\uFF0C\u901A\u8FC7\u53CD\u5C04\u5224\u65AD\u5F53\u524D\u8BBF\u95EE\u7684\u65B9\u6CD5\u662F\u5426\u6709\u8BE5\u6CE8\u89E3\u3002",paraId:7,tocIndex:3},{value:`@Component
public class RiskInterceptor implements HandlerInterceptor {

    @Autowired
    private RiskSecurityUtils riskSecurityUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. \u5982\u679C\u4E0D\u662F\u6620\u5C04\u5230\u65B9\u6CD5\uFF08\u6BD4\u5982\u9759\u6001\u8D44\u6E90\uFF09\uFF0C\u76F4\u63A5\u653E\u884C
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 2. \u68C0\u67E5\u65B9\u6CD5\u4E0A\u662F\u5426\u6709 @RiskCheck \u6CE8\u89E3
        RiskCheck riskCheck = handlerMethod.getMethodAnnotation(RiskCheck.class);
        
        // 3. \u5982\u679C\u6CA1\u6709\u6CE8\u89E3\uFF0C\u8BF4\u660E\u4E0D\u9700\u8981 Risk \u6821\u9A8C\uFF0C\u76F4\u63A5\u653E\u884C
        if (riskCheck == null || !riskCheck.required()) {
            return true;
        }

        // 4. \u6267\u884C\u6838\u5FC3\u6821\u9A8C\u903B\u8F91
        String riskToken = request.getHeader("X-Risk-Token");
        String deviceId = request.getHeader("X-Device-ID");

        if (StringUtils.isEmpty(riskToken) || !riskSecurityUtils.verifyToken(riskToken, deviceId)) {
            // \u6821\u9A8C\u5931\u8D25\uFF0C\u629B\u51FA\u81EA\u5B9A\u4E49\u5F02\u5E38\u6216\u8FD4\u56DE\u9519\u8BEF\u4FE1\u606F
            throw new RuntimeException("Risk verification failed");
        }

        return true;
    }
}
`,paraId:8,tocIndex:3},{value:"\u4F60\u53EA\u9700\u8981\u5728\u7279\u5B9A\u7684\u63A5\u53E3\u4E0A\u52A0\u4E0A\u6CE8\u89E3\u5373\u53EF\uFF1A",paraId:9,tocIndex:4},{value:`@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    @RiskCheck // \u53EA\u6709\u8FD9\u4E2A\u63A5\u53E3\u4F1A\u88AB\u62E6\u622A\u903B\u8F91\u5904\u7406
    public Result login(@RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }

    @GetMapping("/config")
    public Result getPublicConfig() { // \u8FD9\u4E2A\u63A5\u53E3\u4E0D\u5E26\u6CE8\u89E3\uFF0C\u76F4\u63A5\u653E\u884C
        return Result.success();
    }
}
`,paraId:10,tocIndex:4},{value:"\u5728\u5B9E\u9645\u4E1A\u52A1\u4E2D\uFF0C\u9664\u4E86\u767B\u5F55\u6CE8\u518C\uFF0C\u4EE5\u4E0B\u573A\u666F\u901A\u5E38\u4E5F\u9700\u8981 ",paraId:11,tocIndex:5},{value:"X-Risk-Token",paraId:11,tocIndex:5},{value:" \u4FDD\u62A4\uFF1A",paraId:11,tocIndex:5},{value:"\u627E\u56DE\u5BC6\u7801/\u4FEE\u6539\u5BC6\u7801\uFF1A",paraId:12,tocIndex:6},{value:" \u9632\u6B62\u9ED1\u5BA2\u5229\u7528\u649E\u5E93\u62FF\u5230\u7684\u624B\u673A\u53F7\u8FDB\u884C\u66B4\u529B\u91CD\u7F6E\u3002",paraId:12,tocIndex:6},{value:"\u66F4\u6362\u7ED1\u5B9A\u624B\u673A\u53F7/\u90AE\u7BB1\uFF1A",paraId:12,tocIndex:6},{value:" \u6D89\u53CA\u8D26\u53F7\u5F52\u5C5E\u6743\uFF0C\u5FC5\u987B\u9632\u8303\u81EA\u52A8\u5316\u811A\u672C\u3002",paraId:12,tocIndex:6},{value:"\u6CE8\u9500\u8D26\u53F7\uFF1A",paraId:12,tocIndex:6},{value:" \u9632\u6B62\u6076\u610F\u64CD\u4F5C\u5BFC\u81F4\u7528\u6237\u6570\u636E\u4E22\u5931\u3002",paraId:12,tocIndex:6},{value:"\u652F\u4ED8/\u63D0\u73B0\u4E0B\u5355\uFF1A",paraId:13,tocIndex:7},{value:" \u9632\u6B62\u201C\u4E2D\u95F4\u4EBA\u653B\u51FB\u201D\u6216\u6A21\u62DF\u8BF7\u6C42\u8FDB\u884C\u975E\u6CD5\u8F6C\u8D26\u3002",paraId:13,tocIndex:7},{value:"\u865A\u62DF\u8D27\u5E01\u6D88\u8017\uFF08\u5982\u91D1\u5E01\u3001\u79EF\u5206\uFF09\uFF1A",paraId:13,tocIndex:7},{value:" \u9632\u6B62\u5916\u6302\u81EA\u52A8\u5316\u6D88\u8017\u7528\u6237\u8D44\u4EA7\u3002",paraId:13,tocIndex:7},{value:"\u7ED1\u5B9A\u94F6\u884C\u5361/\u5B9E\u540D\u8BA4\u8BC1\uFF1A",paraId:13,tocIndex:7},{value:" \u6D89\u53CA\u654F\u611F\u4E2A\u4EBA\u9690\u79C1\u3002",paraId:13,tocIndex:7},{value:"\u9886\u53D6\u5927\u989D\u4F18\u60E0\u5238\uFF1A",paraId:14,tocIndex:8},{value:" \u9632\u6B62\u7F8A\u6BDB\u515A\u6279\u91CF\u5237\u5238\u3002",paraId:14,tocIndex:8},{value:"\u62BD\u5956\u63A5\u53E3\uFF1A",paraId:14,tocIndex:8},{value:" \u9632\u6B62\u901A\u8FC7\u811A\u672C\u5B9E\u73B0\u9AD8\u9891\u7387\u62BD\u5956\u3002",paraId:14,tocIndex:8},{value:"\u62A2\u8D2D/\u79D2\u6740\u4E0B\u5355\uFF1A",paraId:14,tocIndex:8},{value:" \u9632\u6B62\u811A\u672C\u62A2\u5360\u5E93\u5B58\u3002",paraId:14,tocIndex:8},{value:"\u53D1\u5E03\u8BC4\u8BBA/\u52A8\u6001\uFF08\u9996\u53D1\uFF09\uFF1A",paraId:15,tocIndex:9},{value:" \u5C24\u5176\u662F\u65B0\u8D26\u53F7\u7684\u524D\u51E0\u6B21\u53D1\u5E16\u3002",paraId:15,tocIndex:9},{value:"\u6279\u91CF\u79C1\u4FE1/\u6253\u62DB\u547C\uFF1A",paraId:15,tocIndex:9},{value:" \u793E\u4EA4\u8F6F\u4EF6\u4E2D\u9632\u6B62\u8425\u9500\u53F7\u9A9A\u6270\u3002",paraId:15,tocIndex:9},{value:"\u5206\u7EA7\u9632\u5FA1\uFF1A",paraId:16,tocIndex:10},{value:" \u5C06\u6240\u6709\u63A5\u53E3\u5206\u4E3A ",paraId:16,tocIndex:10},{value:"\u516C\u5F00(Public)",paraId:16,tocIndex:10},{value:"\u3001",paraId:16,tocIndex:10},{value:"\u9700\u767B\u5F55(Auth)",paraId:16,tocIndex:10},{value:"\u3001",paraId:16,tocIndex:10},{value:"\u9AD8\u98CE\u9669(Risk)",paraId:16,tocIndex:10},{value:" \u4E09\u7C7B\u3002",paraId:16,tocIndex:10},{value:"\u9ED8\u8BA4\u5173\u95ED\uFF1A",paraId:16,tocIndex:10},{value:" \u9ED8\u8BA4\u4E0D\u5F00\u542F Risk \u6821\u9A8C\uFF0C\u53EA\u5BF9\u4E0A\u8FF0\u9AD8\u98CE\u9669\u63A5\u53E3\u624B\u52A8\u6DFB\u52A0 ",paraId:16,tocIndex:10},{value:"@RiskCheck",paraId:16,tocIndex:10},{value:"\u3002",paraId:16,tocIndex:10},{value:"\u7070\u5EA6\u7B56\u7565\uFF1A",paraId:16,tocIndex:10},{value:" \u5982\u679C\u7531\u4E8E ",paraId:16,tocIndex:10},{value:"X-Risk-Token",paraId:16,tocIndex:10},{value:" \u903B\u8F91\u53D8\u52A8\u62C5\u5FC3\u5F71\u54CD\u4E1A\u52A1\uFF0C\u53EF\u4EE5\u5728\u6CE8\u89E3\u91CC\u52A0\u4E2A\u53C2\u6570\uFF0C\u7ED3\u5408\u914D\u7F6E\u4E2D\u5FC3\u5B9E\u73B0\u201C\u53EA\u9A8C\u8BC1\u3001\u4E0D\u62E6\u622A\u201D\u7684\u89C2\u5BDF\u6A21\u5F0F\uFF0C\u7B49\u7EBF\u4E0A\u6570\u636E\u7A33\u5B9A\u540E\u518D\u771F\u6B63\u62E6\u622A\u3002",paraId:16,tocIndex:10},{value:"\u8FD9\u79CD",paraId:17,tocIndex:10},{value:"\u57FA\u4E8E\u6CE8\u89E3",paraId:17,tocIndex:10},{value:"\u7684\u65B9\u5F0F\uFF0C\u80FD\u8BA9\u4F60\u7684 ",paraId:17,tocIndex:10},{value:"AuthController",paraId:17,tocIndex:10},{value:" \u4FDD\u6301\u6E05\u6670\u7684\u8F6C\u53D1\u804C\u8D23\uFF0C\u540C\u65F6\u8BA9\u5B89\u5168\u903B\u8F91\u53D8\u5F97\u975E\u5E38\u7075\u6D3B\u3002",paraId:17,tocIndex:10}]},28998:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[]},45919:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[{value:`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
`,paraId:0,tocIndex:1},{value:"\u8FD9\u4E2A\u4F9D\u8D56\u867D\u7136\u4E0D\u53C2\u4E0E\u7F16\u8BD1\u8FD0\u884C\uFF0C\u4F46\u5B83\u662F\u5927\u5382\u9879\u76EE\u7684\u201C\u6DA6\u6ED1\u5242\u201D\u3002",paraId:1,tocIndex:1},{value:"\u4F5C\u7528\uFF1A\u5B83\u4F1A\u626B\u63CF\u4F60\u7684 @ConfigurationProperties \u6CE8\u89E3\uFF0C\u751F\u6210\u4E00\u4EFD\u5143\u6570\u636E\u6587\u4EF6\u3002",paraId:2,tocIndex:1},{value:"\u597D\u5904\uFF1A\u5F53\u4F60\u4EE5\u540E\u5728 application.yml \u91CC\u8F93\u5165 app.security.risk... \u65F6\uFF0CVS Code \u4F1A\u81EA\u52A8\u5F39\u51FA\u4EE3\u7801\u8865\u5168\uFF0C\u5E76\u663E\u793A\u4F60\u5728\u4EE3\u7801\u91CC\u5199\u7684\u6CE8\u91CA\u3002",paraId:3,tocIndex:1}]},45884:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[]},10762:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[{value:`-- KEYS[1]: IP \u9650\u6D41 Key, KEYS[2]: Device \u9650\u6D41 Key, KEYS[3]: NAT \u96C6\u5408 Key
-- ARGV[1]: IP \u6700\u5927\u6B21\u6570, ARGV[2]: Device \u6700\u5927\u6B21\u6570, ARGV[3]: \u8FC7\u671F\u65F6\u95F4(\u79D2), ARGV[4]: DeviceID

-- 1. \u66F4\u65B0 NAT \u8BBE\u5907\u96C6\u5408\uFF08\u9759\u9ED8\u91C7\u96C6\uFF09
if ARGV[4] ~= "" then
    redis.call('SADD', KEYS[3], ARGV[4])
    redis.call('EXPIRE', KEYS[3], ARGV[3])
end

-- 2. \u68C0\u67E5\u8BBE\u5907\u9650\u6D41 (\u9AD8\u538B\u7EBF)
local dev_curr = redis.call('get', KEYS[2])
if dev_curr and tonumber(dev_curr) >= tonumber(ARGV[2]) then
    return -1 -- \u9519\u8BEF\u7801 -1: \u8BBE\u5907\u88AB\u5C01
end

-- 3. \u68C0\u67E5 IP \u9650\u6D41 (\u57FA\u7840\u7EBF)
local ip_curr = redis.call('get', KEYS[1])
if ip_curr and tonumber(ip_curr) >= tonumber(ARGV[1]) then
    return -2 -- \u9519\u8BEF\u7801 -2: IP \u88AB\u5C01
end

-- 4. \u8BA1\u6570\u589E\u52A0
local res_dev = redis.call('INCR', KEYS[2])
if tonumber(res_dev) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end

local res_ip = redis.call('INCR', KEYS[1])
if tonumber(res_ip) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end

return 1 -- \u6210\u529F\u901A\u8FC7
`,paraId:0,tocIndex:0},{value:"\u8FD9\u6BB5 Lua \u811A\u672C\u662F\u4E00\u4E2A ",paraId:1,tocIndex:0},{value:"Redis \u9650\u6D41\u811A\u672C",paraId:1,tocIndex:0},{value:"\uFF0C\u5B9E\u73B0\u4E86\uFF1A",paraId:1,tocIndex:0},{value:"\u2705 IP \u9650\u6D41",paraId:2,tocIndex:0},{value:"\u2705 \u8BBE\u5907\u9650\u6D41\uFF08\u66F4\u4E25\u683C\uFF09",paraId:2,tocIndex:0},{value:"\u2705 NAT \u8BBE\u5907\u91C7\u96C6\uFF08\u8BB0\u5F55\u4E00\u4E2A IP \u4E0B\u7684\u8BBE\u5907\u96C6\u5408\uFF09",paraId:2,tocIndex:0},{value:"\u2705 \u539F\u5B50\u6267\u884C\uFF08Redis Lua \u4FDD\u8BC1\u6574\u4E2A\u811A\u672C\u4E0D\u53EF\u88AB\u6253\u65AD\uFF09",paraId:2,tocIndex:0},{value:"\u6211\u7ED9\u4F60\u9010\u884C\u8BE6\u7EC6\u89E3\u91CA \u{1F447}",paraId:3,tocIndex:0},{value:`-- KEYS[1]: IP \u9650\u6D41 Key, KEYS[2]: Device \u9650\u6D41 Key, KEYS[3]: NAT \u96C6\u5408 Key
-- ARGV[1]: IP \u6700\u5927\u6B21\u6570, ARGV[2]: Device \u6700\u5927\u6B21\u6570, ARGV[3]: \u8FC7\u671F\u65F6\u95F4(\u79D2), ARGV[4]: DeviceID
`,paraId:4,tocIndex:1},{value:"\u7D22\u5F15",paraId:5,tocIndex:2},{value:"\u542B\u4E49",paraId:5,tocIndex:2},{value:"KEYS[1]",paraId:5,tocIndex:2},{value:"IP \u8BA1\u6570 key",paraId:5,tocIndex:2},{value:"KEYS[2]",paraId:5,tocIndex:2},{value:"\u8BBE\u5907 \u8BA1\u6570 key",paraId:5,tocIndex:2},{value:"KEYS[3]",paraId:5,tocIndex:2},{value:"NAT \u8BBE\u5907\u96C6\u5408 key",paraId:5,tocIndex:2},{value:"\u7D22\u5F15",paraId:6,tocIndex:3},{value:"\u542B\u4E49",paraId:6,tocIndex:3},{value:"ARGV[1]",paraId:6,tocIndex:3},{value:"IP \u6700\u5927\u5141\u8BB8\u6B21\u6570",paraId:6,tocIndex:3},{value:"ARGV[2]",paraId:6,tocIndex:3},{value:"\u8BBE\u5907\u6700\u5927\u5141\u8BB8\u6B21\u6570",paraId:6,tocIndex:3},{value:"ARGV[3]",paraId:6,tocIndex:3},{value:"\u8FC7\u671F\u65F6\u95F4\uFF08\u79D2\uFF09",paraId:6,tocIndex:3},{value:"ARGV[4]",paraId:6,tocIndex:3},{value:"\u5F53\u524D\u8BF7\u6C42\u7684\u8BBE\u5907 ID",paraId:6,tocIndex:3},{value:`if ARGV[4] ~= "" then
    redis.call('SADD', KEYS[3], ARGV[4])
    redis.call('EXPIRE', KEYS[3], ARGV[3])
end
`,paraId:7,tocIndex:4},{value:`if ARGV[4] ~= "" then
`,paraId:8,tocIndex:5},{value:"\u610F\u601D\uFF1A",paraId:9,tocIndex:5},{value:"\u5982\u679C\u4F20\u5165\u4E86 DeviceID\uFF08\u4E0D\u4E3A\u7A7A\u5B57\u7B26\u4E32\uFF09",paraId:10,tocIndex:5},{value:"\u8BF4\u660E\uFF1A",paraId:11,tocIndex:5},{value:"\u6709\u4E9B\u60C5\u51B5\u53EF\u80FD\u53EA\u505A IP \u9650\u6D41\uFF0C\u6CA1\u6709\u8BBE\u5907\u53F7",paraId:12,tocIndex:5},{value:"\u8FD9\u91CC\u505A\u4FDD\u62A4\u5224\u65AD",paraId:12,tocIndex:5},{value:`redis.call('SADD', KEYS[3], ARGV[4])
`,paraId:13,tocIndex:6},{value:"\u6267\u884C Redis \u547D\u4EE4\uFF1A",paraId:14,tocIndex:6},{value:`SADD NAT\u96C6\u5408 \u8BBE\u5907ID
`,paraId:15,tocIndex:6},{value:"\u4F5C\u7528\uFF1A",paraId:16,tocIndex:6},{value:"\u628A\u5F53\u524D\u8BBE\u5907 ID \u52A0\u5165 NAT \u96C6\u5408",paraId:17,tocIndex:6},{value:"\u81EA\u52A8\u53BB\u91CD\uFF08Set \u7ED3\u6784\uFF09",paraId:17,tocIndex:6},{value:"\u7528\u9014\uFF1A",paraId:18,tocIndex:6},{value:"\u7EDF\u8BA1\u4E00\u4E2A IP \u4E0B\u6709\u591A\u5C11\u8BBE\u5907\uFF08\u8BC6\u522B\u5171\u4EAB IP\u3001\u673A\u623F\u4EE3\u7406\u3001NAT \u884C\u4E3A\uFF09",paraId:19,tocIndex:6},{value:`redis.call('EXPIRE', KEYS[3], ARGV[3])
`,paraId:20,tocIndex:7},{value:"\u7ED9 NAT \u96C6\u5408\u8BBE\u7F6E\u8FC7\u671F\u65F6\u95F4\u3002",paraId:21,tocIndex:7},{value:"\u4F5C\u7528\uFF1A",paraId:22,tocIndex:7},{value:"\u9632\u6B62 NAT \u96C6\u5408\u6C38\u4E45\u589E\u957F",paraId:23,tocIndex:7},{value:"\u548C\u9650\u6D41\u7A97\u53E3\u4FDD\u6301\u4E00\u81F4",paraId:23,tocIndex:7},{value:`local dev_curr = redis.call('get', KEYS[2])
`,paraId:24,tocIndex:8},{value:"\u4ECE Redis \u83B7\u53D6\uFF1A",paraId:25,tocIndex:8},{value:`GET deviceKey
`,paraId:26,tocIndex:8},{value:"\u7ED3\u679C\uFF1A",paraId:27,tocIndex:8},{value:"nil \u2192 \u8FD8\u6CA1\u8BA1\u6570",paraId:28,tocIndex:8},{value:"\u6570\u5B57 \u2192 \u5F53\u524D\u8BBE\u5907\u8BBF\u95EE\u6B21\u6570",paraId:28,tocIndex:8},{value:`if dev_curr and tonumber(dev_curr) >= tonumber(ARGV[2]) then
`,paraId:29,tocIndex:8},{value:"\u610F\u601D\uFF1A",paraId:30,tocIndex:8},{value:"\u5982\u679C\u5F53\u524D\u8BBE\u5907\u5DF2\u6709\u8BA1\u6570",paraId:31,tocIndex:8},{value:"\u5E76\u4E14 >= \u6700\u5927\u8BBE\u5907\u6B21\u6570",paraId:31,tocIndex:8},{value:`return -1 -- \u9519\u8BEF\u7801 -1: \u8BBE\u5907\u88AB\u5C01
`,paraId:32,tocIndex:8},{value:"\u76F4\u63A5\u8FD4\u56DE -1",paraId:33,tocIndex:8},{value:"\u542B\u4E49\uFF1A",paraId:34,tocIndex:8},{value:"\u8FD4\u56DE\u503C",paraId:35,tocIndex:8},{value:"\u610F\u4E49",paraId:35,tocIndex:8},{value:"-1",paraId:35,tocIndex:8},{value:"\u8BBE\u5907\u9650\u6D41\u89E6\u53D1",paraId:35,tocIndex:8},{value:"\u26A0\uFE0F \u6CE8\u610F\uFF1A",paraId:36,tocIndex:8},{value:`\u811A\u672C\u7ACB\u5373\u7ED3\u675F
\u4E0D\u4F1A\u518D\u6267\u884C IP \u8BA1\u6570`,paraId:37,tocIndex:8},{value:"\u8FD9\u5C31\u662F\uFF1A",paraId:38,tocIndex:8},{value:"\u8BBE\u5907\u9650\u6D41\u4F18\u5148\u7EA7\u9AD8\u4E8E IP \u9650\u6D41",paraId:39,tocIndex:8},{value:`local ip_curr = redis.call('get', KEYS[1])
`,paraId:40,tocIndex:9},{value:"\u83B7\u53D6 IP \u5F53\u524D\u8BBF\u95EE\u6B21\u6570\u3002",paraId:41,tocIndex:9},{value:`if ip_curr and tonumber(ip_curr) >= tonumber(ARGV[1]) then
`,paraId:42,tocIndex:9},{value:"\u5982\u679C IP \u6B21\u6570 >= IP \u6700\u5927\u6B21\u6570\u3002",paraId:43,tocIndex:9},{value:`return -2 -- \u9519\u8BEF\u7801 -2: IP \u88AB\u5C01
`,paraId:44,tocIndex:9},{value:"\u8FD4\u56DE -2",paraId:45,tocIndex:9},{value:"\u8FD4\u56DE\u503C",paraId:46,tocIndex:9},{value:"\u610F\u4E49",paraId:46,tocIndex:9},{value:"-2",paraId:46,tocIndex:9},{value:"IP \u9650\u6D41\u89E6\u53D1",paraId:46,tocIndex:9},{value:"\u53EA\u6709\u524D\u9762\u90FD\u6CA1\u89E6\u53D1\u5C01\u7981\uFF0C\u624D\u4F1A\u6267\u884C\u8FD9\u91CC\u3002",paraId:47,tocIndex:10},{value:`local res_dev = redis.call('INCR', KEYS[2])
`,paraId:48,tocIndex:11},{value:"\u6267\u884C\uFF1A",paraId:49,tocIndex:11},{value:`INCR deviceKey
`,paraId:50,tocIndex:11},{value:"\u4F5C\u7528\uFF1A",paraId:51,tocIndex:11},{value:"\u8BBE\u5907\u8BBF\u95EE\u6B21\u6570 +1",paraId:52,tocIndex:11},{value:"\u5982\u679C key \u4E0D\u5B58\u5728\uFF0C\u4F1A\u81EA\u52A8\u521B\u5EFA\u5E76\u53D8\u6210 1",paraId:52,tocIndex:11},{value:`if tonumber(res_dev) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end
`,paraId:53,tocIndex:11},{value:"\u610F\u601D\uFF1A",paraId:54,tocIndex:11},{value:"\u5982\u679C\u8FD9\u662F\u7B2C\u4E00\u6B21\u8BA1\u6570\uFF08\u503C\u7B49\u4E8E 1\uFF09",paraId:55,tocIndex:11},{value:"\u624D\u8BBE\u7F6E\u8FC7\u671F\u65F6\u95F4\u3002",paraId:56,tocIndex:11},{value:"\u76EE\u7684\uFF1A",paraId:57,tocIndex:11},{value:"\u5F62\u6210\u56FA\u5B9A\u65F6\u95F4\u7A97\u53E3",paraId:58,tocIndex:11},{value:"\u907F\u514D\u6BCF\u6B21\u8BF7\u6C42\u90FD\u5237\u65B0\u8FC7\u671F\u65F6\u95F4",paraId:58,tocIndex:11},{value:"\u8FD9\u662F\u4E00\u79CD\uFF1A",paraId:59,tocIndex:11},{value:"\u56FA\u5B9A\u7A97\u53E3\u9650\u6D41\u7B97\u6CD5\uFF08Fixed Window\uFF09",paraId:60,tocIndex:11},{value:`local res_ip = redis.call('INCR', KEYS[1])
`,paraId:61,tocIndex:12},{value:"IP \u6B21\u6570 +1\u3002",paraId:62,tocIndex:12},{value:`if tonumber(res_ip) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end
`,paraId:63,tocIndex:12},{value:"\u540C\u6837\uFF1A",paraId:64,tocIndex:12},{value:"\u7B2C\u4E00\u6B21\u8BBF\u95EE\u624D\u8BBE\u7F6E TTL",paraId:65,tocIndex:12},{value:"\u4FDD\u8BC1\u65F6\u95F4\u7A97\u53E3\u56FA\u5B9A",paraId:65,tocIndex:12},{value:`return 1 -- \u6210\u529F\u901A\u8FC7
`,paraId:66,tocIndex:13},{value:"\u8868\u793A\uFF1A",paraId:67,tocIndex:13},{value:"\u8FD4\u56DE\u503C",paraId:68,tocIndex:13},{value:"\u542B\u4E49",paraId:68,tocIndex:13},{value:"1",paraId:68,tocIndex:13},{value:"\u8BF7\u6C42\u901A\u8FC7",paraId:68,tocIndex:13},{value:`1\uFE0F\u20E3 \u8BB0\u5F55 NAT \u8BBE\u5907
        \u2193
2\uFE0F\u20E3 \u8BBE\u5907\u662F\u5426\u8D85\u9650\uFF1F
        \u2193
      \u662F \u2192 \u8FD4\u56DE -1
        \u2193
3\uFE0F\u20E3 IP \u662F\u5426\u8D85\u9650\uFF1F
        \u2193
      \u662F \u2192 \u8FD4\u56DE -2
        \u2193
4\uFE0F\u20E3 \u8BBE\u5907 +1
5\uFE0F\u20E3 IP +1
        \u2193
\u8FD4\u56DE 1
`,paraId:69,tocIndex:14},{value:"\u8FD4\u56DE\u503C",paraId:70,tocIndex:15},{value:"\u542B\u4E49",paraId:70,tocIndex:15},{value:"1",paraId:70,tocIndex:15},{value:"\u6210\u529F",paraId:70,tocIndex:15},{value:"-1",paraId:70,tocIndex:15},{value:"\u8BBE\u5907\u9650\u6D41",paraId:70,tocIndex:15},{value:"-2",paraId:70,tocIndex:15},{value:"IP \u9650\u6D41",paraId:70,tocIndex:15},{value:`\u2705 \u539F\u5B50\u6267\u884C\uFF08Redis Lua\uFF09
\u2705 \u8BBE\u5907\u4F18\u5148\u7EA7\u9AD8
\u2705 \u652F\u6301 NAT \u91C7\u96C6
\u2705 \u81EA\u52A8\u8FC7\u671F
\u2705 \u65E0\u5E76\u53D1\u95EE\u9898
\u2705 \u8F7B\u91CF\u9AD8\u6027\u80FD`,paraId:71,tocIndex:16},{value:"\u8FD9\u662F\uFF1A",paraId:72,tocIndex:17},{value:"\u56FA\u5B9A\u65F6\u95F4\u7A97\u53E3\u9650\u6D41\uFF08Fixed Window Rate Limiting\uFF09",paraId:73,tocIndex:17},{value:"\u4E0D\u662F\u6ED1\u52A8\u7A97\u53E3\u3002",paraId:74,tocIndex:17},{value:"\u5982\u679C\u4F60\u613F\u610F\uFF0C\u6211\u53EF\u4EE5\u5E2E\u4F60\uFF1A",paraId:75,tocIndex:17},{value:"\u{1F525} \u6539\u9020\u6210\u6ED1\u52A8\u7A97\u53E3\u7248\u672C",paraId:76,tocIndex:17},{value:"\u{1F525} \u6539\u9020\u6210\u6F0F\u6876\u7B97\u6CD5",paraId:76,tocIndex:17},{value:"\u{1F525} \u52A0\u5165 NAT \u8BBE\u5907\u6570\u91CF\u9608\u503C\u63A7\u5236",paraId:76,tocIndex:17},{value:"\u{1F525} \u4F18\u5316\u6210\u751F\u4EA7\u7EA7\u9AD8\u5E76\u53D1\u7248\u672C",paraId:76,tocIndex:17},{value:"\u4F60\u8FD9\u4E2A\u8BBE\u8BA1\u5DF2\u7ECF\u5F88\u4E13\u4E1A\u4E86 \u{1F44D}",paraId:77,tocIndex:17}]},24842:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[{value:"This is a guide example.",paraId:0}]},9177:function(I,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[]}}]);
