"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[503],{55503:function(d,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[{value:"\u628A\u201C\u8FDB\u95E8\u524D\u7684\u68C0\u67E5\u201D\u4EA4\u7ED9\u62E6\u622A\u5668\uFF0C\u628A\u201C\u8FDB\u95E8\u540E\u7684\u60E9\u7F5A\u201D\u7559\u5728\u4E1A\u52A1\u5C42",paraId:0,tocIndex:2},{value:"\u4EE3\u7801\u903B\u8F91",paraId:1,tocIndex:2},{value:"\u5F52\u5C5E\u5730",paraId:1,tocIndex:2},{value:"\u8FC1\u79FB\u539F\u56E0",paraId:1,tocIndex:2},{value:"IP \u7EF4\u5EA6\u9650\u6D41",paraId:1,tocIndex:2},{value:"\u62E6\u622A\u5668 (Interceptor)",paraId:1,tocIndex:2},{value:"\u8FD9\u662F\u5178\u578B\u7684\u201C\u6D41\u91CF\u5B88\u95E8\u5458\u201D\u5DE5\u4F5C\u3002\u4E0D\u7BA1\u7528\u6237\u540D\u5BF9\u9519\uFF0C\u9AD8\u9891\u8BF7\u6C42\u76F4\u63A5\u5728\u5916\u9762\u6321\u6389\uFF0C\u4FDD\u62A4\u6570\u636E\u5E93\u3002",paraId:1,tocIndex:2},{value:"\u8BBE\u5907\u7EF4\u5EA6\u9650\u6D41",paraId:1,tocIndex:2},{value:"\u62E6\u622A\u5668 (Interceptor)",paraId:1,tocIndex:2},{value:"\u540C\u4E0A\u3002\u5728\u5927\u5382\u4E2D\uFF0CDeviceID \u6821\u9A8C\u662F\u5168\u5C40\u6027\u7684\u5B89\u5168\u5207\u9762\u3002",paraId:1,tocIndex:2},{value:"\u8D26\u53F7\u5931\u8D25\u6B21\u6570\u68C0\u67E5 (\u9636\u68AF\u9501\u5B9A)",paraId:1,tocIndex:2},{value:"AuthServiceImpl (\u4FDD\u7559)",paraId:1,tocIndex:2},{value:"\u5FC5\u987B\u7559\u5728\u8FD9\u91CC",paraId:1,tocIndex:2},{value:"\u3002\u56E0\u4E3A\u62E6\u622A\u5668\u65E0\u6CD5\u63D0\u524D\u77E5\u9053\u7528\u6237\u8F93\u5165\u7684 ",paraId:1,tocIndex:2},{value:"username",paraId:1,tocIndex:2},{value:" \u662F\u5426\u771F\u5B9E\u5B58\u5728\uFF0C\u6216\u8005\u662F\u5426\u9700\u8981\u9488\u5BF9\u7279\u5B9A\u7528\u6237\u6267\u884C\u9501\u5B9A\u3002",paraId:1,tocIndex:2},{value:"\u9A8C\u8BC1\u7801\u6821\u9A8C (\u9636\u68AF A)",paraId:1,tocIndex:2},{value:"AuthServiceImpl (\u4FDD\u7559)",paraId:1,tocIndex:2},{value:"\u9A8C\u8BC1\u7801\u901A\u5E38\u548C\u5177\u4F53\u7684\u767B\u5F55\u64CD\u4F5C\uFF08\u7528\u6237\u540D\u5BC6\u7801\uFF09\u5F3A\u7ED1\u5B9A\u3002",paraId:1,tocIndex:2},{value:"\u5C06IP \u548C DeviceID \u7684\u7269\u7406\u9650\u6D41\u79FB\u51FA\u4E1A\u52A1\u4EE3\u7801\uFF0C\u653E\u5728\u62E6\u622A\u5668\u4E2D,\u5F53\u524D\u8BE5\u6587\u4EF6\u6240\u5728\u76EE\u5F55  ",paraId:2,tocIndex:3},{value:"config/interceptor/",paraId:2,tocIndex:3},{value:`// RiskControlInterceptor.java
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    String ip = request.getRemoteAddr();
    String deviceId = request.getHeader("X-Device-ID");

    // 1. IP \u9650\u6D41\uFF08\u8FC1\u79FB\u81EA AuthServiceImpl\uFF09
    if (!redisUtils.isAllowed("limit:ip:" + ip, 10, 60)) {
        throw new BusinessException(429, "\u64CD\u4F5C\u9891\u7E41\uFF0C\u8BF71\u5206\u949F\u540E\u518D\u8BD5");
    }

    // 2. \u8BBE\u5907\u9650\u6D41\uFF08\u65B0\u589E\u7684\u5927\u5382\u589E\u5F3A\u7EF4\u5EA6\uFF09
    if (StringUtils.isNotBlank(deviceId)) {
        if (!redisUtils.isAllowed("limit:device:" + deviceId, 5, 60)) {
            throw new BusinessException(429, "\u5F53\u524D\u8BBE\u5907\u5C1D\u8BD5\u9891\u7E41");
        }
    }
    return true;
}
`,paraId:3,tocIndex:3},{value:"AuthServiceImpl",paraId:4},{value:"\u73B0\u5728\u7684 ",paraId:5,tocIndex:4},{value:"login",paraId:5,tocIndex:4},{value:" \u65B9\u6CD5\u53D8\u5F97\u975E\u5E38\u5E72\u51C0\uFF0C\u53EA\u5173\u6CE8\u201C\u8D26\u53F7\u5B89\u5168\u201D\u903B\u8F91\u3002",paraId:5,tocIndex:4},{value:`public LoginResponse login(LoginRequest request, HttpServletResponse response) {
    String username = request.getUsername();
    String failKey = "login:fail:user:" + username;

    // 1. \u8D26\u53F7\u9501\u5B9A\u68C0\u67E5 (\u5C5E\u4E8E\u4E1A\u52A1\u98CE\u63A7\uFF0C\u4FDD\u7559)
    checkAccountLockStatus(failKey);

    // 2. \u9A8C\u8BC1\u7801\u6821\u9A8C (\u5C5E\u4E8E\u4E1A\u52A1\u6D41\u7A0B\uFF0C\u4FDD\u7559)
    handleCaptchaIfNecessary(request, failKey);

    try {
        // 3. \u6838\u5FC3\u8BA4\u8BC1\u903B\u8F91
        User dbUser = userService.authenticate(username, request.getPassword());
        
        // \u767B\u5F55\u6210\u529F\u6E05\u7A7A\u8BA1\u6570
        redisTemplate.delete(failKey);
        
        // \u751F\u6210\u4EE4\u724C\u7B49\u540E\u7EED\u64CD\u4F5C...
        return responseData;
        
    } catch (BadCredentialsException e) {
        // 4. \u53EA\u6709\u8BA4\u8BC1\u5931\u8D25\u624D\u589E\u52A0\u8BA1\u6570
        handleLoginFailure(failKey);
        throw new BusinessException(401, "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF");
    }
}
`,paraId:6,tocIndex:4},{value:"\u4FDD\u62A4\u6570\u636E\u5E93\uFF08DB Protection\uFF09",paraId:7,tocIndex:5},{value:"\uFF1A \u5982\u679C IP \u9650\u6D41\u5199\u5728 Service \u91CC\uFF0C\u6076\u610F\u653B\u51FB\u8005\u6BCF\u5206\u949F\u53D1 10000 \u4E2A\u8BF7\u6C42\uFF0CSpring \u4F9D\u7136\u8981\u521B\u5EFA Service \u5B9E\u4F8B\u3001\u89E3\u6790\u53C2\u6570\u3001\u751A\u81F3\u53EF\u80FD\u89E6\u53D1\u6570\u636E\u5E93\u8FDE\u63A5\u3002\u79FB\u5230\u62E6\u622A\u5668\u540E\uFF0C\u8FD9\u4E9B\u65E0\u6548\u6D41\u91CF\u5728\u8FDB\u5165\u6838\u5FC3\u4E1A\u52A1\u5C42\u4E4B\u524D\u5C31\u88AB\u4E22\u5F03\u4E86\u3002",paraId:7,tocIndex:5},{value:"\u89E3\u8026\u4E0E\u590D\u7528",paraId:7,tocIndex:5},{value:"\uFF1A \u4F60\u7684 ",paraId:7,tocIndex:5},{value:"javademo",paraId:7,tocIndex:5},{value:" \u4EE5\u540E\u53EF\u80FD\u6709\u201C\u4FEE\u6539\u652F\u4ED8\u5BC6\u7801\u201D\u3001\u201C\u7ED1\u5B9A\u624B\u673A\u53F7\u201D\u7B49\u63A5\u53E3\u3002\u5982\u679C\u4F60\u628A IP/\u8BBE\u5907\u9650\u6D41\u5199\u5728\u62E6\u622A\u5668\u91CC\uFF0C\u53EA\u9700\u5728 ",paraId:7,tocIndex:5},{value:"WebConfig",paraId:7,tocIndex:5},{value:" \u914D\u7F6E\u4E00\u4E0B\u8DEF\u5F84\uFF0C\u8FD9\u4E9B\u63A5\u53E3\u5C31\u81EA\u52A8\u83B7\u5F97\u4E86\u9632\u5237\u80FD\u529B\uFF0C\u800C\u4E0D\u9700\u8981\u53BB\u6BCF\u4E2A Service \u91CC\u590D\u5236\u7C98\u8D34\u3002",paraId:7,tocIndex:5},{value:"\u7CBE\u786E\u8BA1\u6570",paraId:7,tocIndex:5},{value:"\uFF1A \u73B0\u5728\u7684\u4EE3\u7801\u4E2D\uFF0C\u5982\u679C\u9A8C\u8BC1\u7801\u8F93\u9519\u4E86\uFF0C\u4E5F\u4F1A\u89E6\u53D1 ",paraId:7,tocIndex:5},{value:"catch",paraId:7,tocIndex:5},{value:" \u5BFC\u81F4\u5931\u8D25\u8BA1\u6570\u52A0 1\u3002\u5728\u5927\u5382\u903B\u8F91\u91CC\uFF0C\u8FD9\u53EB\u201C\u8BEF\u6740\u201D\u3002\u901A\u8FC7\u62C6\u5206\uFF0C\u53EA\u6709\u771F\u6B63\u7684",paraId:7,tocIndex:5},{value:"\u5BC6\u7801\u9519\u8BEF",paraId:7,tocIndex:5},{value:"\u624D\u4F1A\u89E6\u53D1\u8D26\u53F7\u9501\u5B9A\u8BA1\u6570\uFF0C\u903B\u8F91\u66F4\u4E25\u5BC6\u3002",paraId:7,tocIndex:5},{value:"\u62E6\u622A\u5668\u4E0D\u53EA\u662F\u201C\u62E6\u622A\u201D\uFF0C\u5B83\u901A\u5E38\u8D1F\u8D23",paraId:8,tocIndex:7},{value:"\u6570\u636E\u91C7\u96C6",paraId:8,tocIndex:7},{value:"\u3002",paraId:8,tocIndex:7},{value:"\u767B\u5F55\u524D",paraId:9,tocIndex:7},{value:"\uFF1A\u62E6\u622A\u5668\u8BB0\u5F55 IP \u548C DeviceID\uFF0C\u5E76\u653E\u5165 ",paraId:9,tocIndex:7},{value:"ThreadLocal",paraId:9,tocIndex:7},{value:"\u3002",paraId:9,tocIndex:7},{value:"\u767B\u5F55\u4E2D",paraId:9,tocIndex:7},{value:"\uFF1A\u4E1A\u52A1\u903B\u8F91\u76F4\u63A5\u4ECE ",paraId:9,tocIndex:7},{value:"ThreadLocal",paraId:9,tocIndex:7},{value:" \u8BFB\uFF0C\u4E0D\u9700\u8981\u518D\u53BB\u89E3\u6790 Request\u3002",paraId:9,tocIndex:7},{value:"\u767B\u5F55\u540E",paraId:9,tocIndex:7},{value:"\uFF1A\u62E6\u622A\u5668\u6839\u636E\u4E1A\u52A1\u7ED3\u679C\uFF08\u6210\u529F/\u5931\u8D25\uFF09\u66F4\u65B0 Redis \u6307\u7EB9\u753B\u50CF\u3002 \u8FD9\u79CD",paraId:9,tocIndex:7},{value:"\u5168\u751F\u547D\u5468\u671F\u7684\u76D1\u63A7",paraId:9,tocIndex:7},{value:"\uFF0C\u5728\u5206\u6563\u7684 Service \u65B9\u6CD5\u91CC\u662F\u5F88\u96BE\u505A\u5230\u7684\u3002",paraId:9,tocIndex:7},{value:"\u5982\u679C\u67D0\u5929\u53D1\u73B0\u4E00\u79CD\u65B0\u578B\u653B\u51FB\u4E13\u95E8\u9488\u5BF9\u201C\u5FD8\u8BB0\u5BC6\u7801\u201D\u63A5\u53E3\uFF0C\u5728\u5927\u5382\u91CC\uFF1A",paraId:10,tocIndex:8},{value:"\u65B9\u5F0F\u4E00\uFF08Service\uFF09",paraId:11,tocIndex:8},{value:"\uFF1A\u9700\u8981\u6539\u4EE3\u7801\u3001\u6D4B\u8BD5\u3001\u8D70\u53D1\u5E03\u6D41\u7A0B\uFF0C\u53EF\u80FD\u9700\u8981\u51E0\u4E2A\u5C0F\u65F6\u3002",paraId:11,tocIndex:8},{value:"\u65B9\u5F0F\u4E8C\uFF08\u7EDF\u4E00\u62E6\u622A\u5668\uFF09",paraId:11,tocIndex:8},{value:"\uFF1A\u8FD0\u7EF4\u6216\u5B89\u5168\u4EBA\u5458\u76F4\u63A5\u5728\u52A8\u6001\u914D\u7F6E\u4E2D\u5FC3\uFF08\u5982 Apollo/Nacos\uFF09\u7ED9\u62E6\u622A\u5668\u52A0\u4E00\u4E2A\u8DEF\u5F84\u8FC7\u6EE4\u89C4\u5219\uFF0C",paraId:11,tocIndex:8},{value:"\u79D2\u7EA7\u751F\u6548",paraId:11,tocIndex:8},{value:"\uFF0C\u77AC\u95F4\u5C01\u6B7B\u653B\u51FB\u8DEF\u5F84\u3002",paraId:11,tocIndex:8},{value:"\u5927\u5382\u4F1A\u5C06\u63A5\u53E3\u5206\u4E3A\u4E0D\u540C\u7B49\u7EA7\uFF1A",paraId:12,tocIndex:9},{value:"L1 (\u516C\u5F00)",paraId:13,tocIndex:9},{value:"\uFF1A\u5982\u9996\u9875\uFF0C\u4E0D\u6821\u9A8C DeviceID\u3002",paraId:13,tocIndex:9},{value:"L2 (\u666E\u901A\u64CD\u4F5C)",paraId:13,tocIndex:9},{value:"\uFF1A\u5982\u770B\u8BC4\u8BBA\uFF0C\u6821\u9A8C DeviceID \u4F46\u4E0D\u9650\u6D41\u3002",paraId:13,tocIndex:9},{value:"L3 (\u9AD8\u5371)",paraId:13,tocIndex:9},{value:"\uFF1A\u5982\u767B\u5F55\u3001\u652F\u4ED8\uFF0C\u5F3A\u5236\u6821\u9A8C DeviceID \u4E14\u6267\u884C\u4E25\u683C\u9650\u6D41\u3002 \u62E6\u622A\u5668\u53EF\u4EE5\u6839\u636E\u6CE8\u89E3\u6216\u8DEF\u5F84\u6A21\u5F0F\uFF08AntPathMatcher\uFF09\u5B8C\u7F8E\u5B9E\u73B0\u8FD9\u79CD",paraId:13,tocIndex:9},{value:"\u7CBE\u7EC6\u5316\u63A7\u5236",paraId:13,tocIndex:9},{value:"\u3002",paraId:13,tocIndex:9},{value:"\u5728\u5927\u5382\u7684\u751F\u4EA7\u73AF\u5883\u91CC\uFF0C\u98CE\u63A7\u62E6\u622A\u5668\u4E0D\u4EC5\u8981\u201C\u62E6\u5F97\u4F4F\u201D\uFF0C\u8FD8\u8981\u201C\u8DD1\u5F97\u5FEB\u201D\u3002\u4E3A\u4E86\u4FDD\u8BC1\u5728\u9AD8\u5E76\u53D1\u767B\u5F55\u8BF7\u6C42\u4E0B\uFF0C\u9650\u6D41\u8BA1\u6570\u4E0D\u4F1A\u56E0\u4E3A\u7F51\u7EDC\u5EF6\u8FDF\u6216\u5E76\u53D1\u5BFC\u81F4\u5931\u6548\uFF0C\u6211\u4EEC\u5FC5\u987B\u4F7F\u7528 ",paraId:14,tocIndex:9},{value:"Redis + Lua \u811A\u672C",paraId:14,tocIndex:9},{value:"\u3002",paraId:14,tocIndex:9},{value:"\u4EE5\u4E0B\u662F\u4E3A\u4F60\u8BBE\u8BA1\u7684 ",paraId:15,tocIndex:9},{value:"RiskControlInterceptor",paraId:15,tocIndex:9},{value:" \u6838\u5FC3\u5B9E\u73B0\u65B9\u6848\u3002",paraId:15,tocIndex:9},{value:"\u4E3A\u4EC0\u4E48\u975E\u8981\u7528 Lua\uFF1F\u56E0\u4E3A ",paraId:16,tocIndex:10},{value:"get",paraId:16,tocIndex:10},{value:"\u3001",paraId:16,tocIndex:10},{value:"incr",paraId:16,tocIndex:10},{value:"\u3001",paraId:16,tocIndex:10},{value:"expire",paraId:16,tocIndex:10},{value:" \u8FD9\u4E09\u6B65\u5982\u679C\u5206\u5F00\u6267\u884C\uFF0C\u5728\u9AD8\u5E76\u53D1\u4E0B\u4F1A\u5BFC\u81F4\u8BA1\u6570\u4E0D\u51C6\uFF08\u7ADE\u6001\u6761\u4EF6\uFF09\u3002Lua \u811A\u672C\u53EF\u4EE5\u50CF\u6570\u636E\u5E93\u4E8B\u52A1\u4E00\u6837\uFF0C\u628A\u8FD9\u51E0\u6B65\u5408\u6210\u4E00\u4E2A\u539F\u5B50\u64CD\u4F5C\u3002",paraId:16,tocIndex:10},{value:"\u4F60\u53EF\u4EE5\u5728\u9879\u76EE\u7684 ",paraId:17,tocIndex:10},{value:"resources",paraId:17,tocIndex:10},{value:" \u76EE\u5F55\u4E0B\u65B0\u5EFA ",paraId:17,tocIndex:10},{value:"lua/limit.lua",paraId:17,tocIndex:10},{value:"\uFF0C\u6216\u8005\u76F4\u63A5\u5728\u4EE3\u7801\u4E2D\u5B9A\u4E49\uFF1A",paraId:17,tocIndex:10},{value:"Lua",paraId:18,tocIndex:10},{value:`-- KEYS[1]: \u5177\u4F53\u7684\u9650\u6D41 Key (\u5982 limit:ip:1.2.3.4)
-- ARGV[1]: \u5141\u8BB8\u7684\u6700\u5927\u5C1D\u8BD5\u6B21\u6570
-- ARGV[2]: \u65F6\u95F4\u7A97\u53E3(\u79D2)

local current = redis.call('get', KEYS[1])
if current and tonumber(current) >= tonumber(ARGV[1]) then
    return 0 -- \u5931\u8D25\uFF1A\u89E6\u53D1\u9650\u6D41
else
    local res = redis.call('incr', KEYS[1])
    if tonumber(res) == 1 then
        redis.call('expire', KEYS[1], ARGV[2])
    end
    return 1 -- \u6210\u529F\uFF1A\u8BA1\u6570\u589E\u52A0\u5E76\u653E\u884C
end
`,paraId:19,tocIndex:10},{value:"\u6211\u4EEC\u5C06 IP \u548C DeviceID \u653E\u5728\u62E6\u622A\u5668\u3002\u6CE8\u610F\uFF1A",paraId:20,tocIndex:11},{value:"User \u7EF4\u5EA6\u7684\u9501\u5B9A\u901A\u5E38\u7559\u5728 Service",paraId:20,tocIndex:11},{value:"\uFF0C\u56E0\u4E3A\u62E6\u622A\u5668\u5728 ",paraId:20,tocIndex:11},{value:"preHandle",paraId:20,tocIndex:11},{value:" \u9636\u6BB5\u5F88\u96BE\u4F18\u96C5\u5730\u5904\u7406\u590D\u6742\u7684\u4E1A\u52A1\u767B\u5F55\u5931\u8D25\u8BA1\u6570\uFF0C\u4F46\u6211\u4EEC\u53EF\u4EE5\u628A\u201C\u7269\u7406\u9650\u6D41\u201D\u653E\u5728\u8FD9\u91CC\u3002",paraId:20,tocIndex:11},{value:`@Component
@RequiredArgsConstructor
public class RiskControlInterceptor implements HandlerInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DefaultRedisScript<Long> limitScript; // \u6CE8\u5165\u4E0A\u9762\u5B9A\u4E49\u7684 Lua \u811A\u672C

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 1. \u83B7\u53D6\u7279\u5F81\u7801
        String ip = getClientIp(request);
        String deviceId = request.getHeader("X-Device-ID");
        // \u4E5F\u53EF\u4EE5\u4ECE\u53C2\u6570\u4E2D\u9884\u53D6 username (\u53EF\u9009)
        String username = request.getParameter("username");

        // 2. IP \u7EF4\u5EA6\u68C0\u67E5 (\u6BCF\u5206\u949F 10 \u6B21)
        checkLimit("limit:ip:" + ip, 10, 60, "\u64CD\u4F5C\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");

        // 3. \u8BBE\u5907\u7EF4\u5EA6\u68C0\u67E5 (\u6BCF\u5206\u949F 5 \u6B21 - \u66F4\u4E25\u683C)
        if (StringUtils.isNotBlank(deviceId)) {
            checkLimit("limit:device:" + deviceId, 5, 60, "\u5F53\u524D\u8BBE\u5907\u8BF7\u6C42\u8FC7\u5FEB");
        }
        
        // 4. \u7528\u6237\u7EF4\u5EA6\u7269\u7406\u9650\u6D41 (\u9632\u6B62\u9488\u5BF9\u5355\u4E2A\u8D26\u53F7\u7684\u77AC\u95F4\u8D85\u9AD8\u5E76\u53D1\u7206\u7834)
        if (StringUtils.isNotBlank(username)) {
             checkLimit("limit:user:freq:" + username, 20, 60, "\u8D26\u53F7\u8BF7\u6C42\u8FC7\u591A");
        }

        return true;
    }

    private void checkLimit(String key, int max, int window, String msg) {
        Long result = redisTemplate.execute(limitScript, Collections.singletonList(key), max, window);
        if (result == null || result == 0) {
            throw new BusinessException(429, msg);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        // \u5927\u5382\u89C4\u8303\uFF1A\u8003\u8651\u8D1F\u8F7D\u5747\u8861(Nginx)\u540E\u7684\u771F\u5B9EIP
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
`,paraId:21,tocIndex:11},{value:"\u73B0\u5728\u7684 ",paraId:22,tocIndex:12},{value:"AuthServiceImpl",paraId:22,tocIndex:12},{value:" \u53EA\u9700\u8981\u5904\u7406\u201C\u5BC6\u7801\u9519\u8BEF\u5BFC\u81F4\u7684\u9636\u68AF\u9501\u5B9A\u201D\uFF0C\u8FD9\u5C5E\u4E8E",paraId:22,tocIndex:12},{value:"\u4E1A\u52A1\u98CE\u63A7",paraId:22,tocIndex:12},{value:"\u3002",paraId:22,tocIndex:12},{value:`public LoginResponse login(LoginRequest request) {
    String username = request.getUsername();
    String failKey = "login:fail:user:" + username;

    // 1. \u68C0\u67E5\u662F\u5426\u5904\u4E8E\u9636\u68AF\u9501\u5B9A\u72B6\u6001 (5\u6B21\u5931\u8D25\u540E\u768415\u5206\u949F\u9501\u5B9A)
    Integer failCount = getFailCount(failKey);
    if (failCount >= 5) {
        throw new BusinessException(423, "\u8D26\u53F7\u5DF2\u9501\u5B9A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
    }

    // 2. \u9A8C\u8BC1\u7801\u6821\u9A8C (3\u6B21\u5931\u8D25\u540E\u7684\u5F3A\u5236\u8981\u6C42)
    if (failCount >= 3) {
        validateCaptcha(request); 
    }

    try {
        // 3. \u6570\u636E\u5E93\u903B\u8F91...
        // \u6210\u529F\u5219\u5220\u9664 failKey
    } catch (BadCredentialsException e) {
        // 4. \u53EA\u6709\u8BA4\u8BC1\u5931\u8D25\u624D\u8BB0\u5F55\uFF0C\u903B\u8F91\u66F4\u4E25\u5BC6
        updateFailCount(failKey);
        throw e;
    }
}
`,paraId:23,tocIndex:12},{value:"\u62E6\u622A\u5668 = \u7269\u7406\u5C4F\u969C",paraId:24,tocIndex:13},{value:"\uFF1A\u5B83\u7684\u76EE\u6807\u662F",paraId:24,tocIndex:13},{value:"\u4FDD\u62A4\u670D\u52A1\u5668\u8D44\u6E90",paraId:24,tocIndex:13},{value:"\u3002\u4E0D\u7BA1\u4F60\u8D26\u53F7\u5BF9\u4E0D\u5BF9\uFF0C\u53EA\u8981\u4F60\u53D1\u5F97\u592A\u5FEB\uFF0C\u6211\u5C31\u628A\u4F60\u5F53\u6210\u673A\u5668\u4EBA\u4E71\u68CD\u6253\u6B7B\uFF0C\u4E0D\u8BA9\u4F60\u6D88\u8017 CPU \u548C\u6570\u636E\u5E93\u8FDE\u63A5\u3002",paraId:24,tocIndex:13},{value:"Service = \u4E1A\u52A1\u903B\u8F91",paraId:24,tocIndex:13},{value:"\uFF1A\u5B83\u7684\u76EE\u6807\u662F",paraId:24,tocIndex:13},{value:"\u8D26\u6237\u5B89\u5168",paraId:24,tocIndex:13},{value:"\u3002\u5B83\u5904\u7406\u7684\u662F\u201C\u5BC6\u7801\u8F93\u9519\u201D\u8FD9\u79CD\u6B63\u5E38\u7528\u6237\u4E5F\u53EF\u80FD\u53D1\u751F\u7684\u64CD\u4F5C\uFF0C\u63D0\u4F9B\u7684\u662F\u201C\u9A8C\u8BC1\u7801\u201D\u3001\u201C\u8D26\u53F7\u627E\u56DE\u201D\u7B49\u6709\u6E29\u5EA6\u7684\u4E1A\u52A1\u6D41\u7A0B\u3002",paraId:24,tocIndex:13},{value:"X-Device-ID",paraId:4},{value:"\u5982\u679C\u4F60\u4F7F\u7528 Vue \u6216 React\uFF0C\u53EF\u4EE5\u5199\u4E00\u4E2A\u5168\u5C40\u7684 Axios \u62E6\u622A\u5668\uFF0C\u786E\u4FDD\u6BCF\u4E00\u7B14\u8BF7\u6C42\u90FD\u5E26\u4E0A\u8FD9\u4E2A\u201C\u8EAB\u4EFD\u8BC1\u201D\u3002",paraId:25,tocIndex:14},{value:`// frontend/src/utils/request.js
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const service = axios.create();

service.interceptors.request.use(async config => {
    // \u4F18\u5148\u4ECE\u672C\u5730\u7F13\u5B58\u53D6\uFF0C\u6CA1\u6709\u5219\u751F\u6210
    let deviceId = localStorage.getItem('X-Device-ID');
    if (!deviceId) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
        localStorage.setItem('X-Device-ID', deviceId);
    }
    
    // \u6CE8\u5165\u8BF7\u6C42\u5934
    config.headers['X-Device-ID'] = deviceId;
    return config;
});
`,paraId:26,tocIndex:14},{value:"\u5206\u5C42\u9632\u5FA1",paraId:27,tocIndex:15},{value:`\uFF1A
`,paraId:27,tocIndex:15},{value:"\u62E6\u622A\u5668",paraId:28,tocIndex:15},{value:" \u6321\u4F4F ",paraId:28,tocIndex:15},{value:"\u201C\u6D41\u91CF\u6D2A\u5CF0\u201D",paraId:28,tocIndex:15},{value:"\uFF08\u4E0D\u7BA1\u8D26\u53F7\u5BF9\u4E0D\u5BF9\uFF0C\u5148\u770B\u4F60\u53D1\u5F97\u5FEB\u4E0D\u5FEB\uFF09\u3002",paraId:28,tocIndex:15},{value:"Service \u5C42",paraId:28,tocIndex:15},{value:" \u6321\u4F4F ",paraId:28,tocIndex:15},{value:"\u201C\u66B4\u529B\u7834\u89E3\u201D",paraId:28,tocIndex:15},{value:"\uFF08\u770B\u4F60\u5BC6\u7801\u5BF9\u4E0D\u5BF9\uFF0C\u8F93\u9519\u51E0\u6B21\u9501\u8D26\u53F7\uFF09\u3002",paraId:28,tocIndex:15},{value:"\u5F39\u6027\u6269\u5BB9",paraId:27,tocIndex:15},{value:`\uFF1A
`,paraId:27,tocIndex:15},{value:"\u81EA\u52A8\u8BC6\u522B\u5C40\u57DF\u7F51/NAT \u73AF\u5883\uFF0C\u6709\u6548\u964D\u4F4E\u4E86\u201C\u529E\u516C\u5BA4\u7528\u6237\u201D\u88AB\u96C6\u4F53\u8BEF\u4F24\u7684\u6982\u7387\u3002",paraId:29,tocIndex:15},{value:"\u539F\u5B50\u5B89\u5168\u6027",paraId:27,tocIndex:15},{value:`\uFF1A
`,paraId:27,tocIndex:15},{value:"\u4F7F\u7528 Lua \u811A\u672C\u786E\u4FDD\u4E86\u5728\u9AD8\u5E76\u53D1\u4E0B\uFF0CRedis \u7684 ",paraId:30,tocIndex:15},{value:"get-check-set",paraId:30,tocIndex:15},{value:" \u8FC7\u7A0B\u4E0D\u4F1A\u51FA\u73B0\u5E76\u53D1 bug\u3002",paraId:30,tocIndex:15},{value:"\u5728\u5F53\u524D\u5927\u5382\uFF08\u5982\u5B57\u8282\u3001\u963F\u91CC\u3001\u7F8E\u56E2\u7B49\uFF09\u7684\u79FB\u52A8\u7AEF\u6216 Web \u7AEF\u67B6\u6784\u4E2D\uFF0C",paraId:31,tocIndex:16},{value:"\u5E76\u4E0D\u662F\u6240\u6709\u63A5\u53E3\u90FD\u5F3A\u5236\u5E26\u4E0A ",paraId:31,tocIndex:16},{value:"X-Risk-Token",paraId:31,tocIndex:16},{value:"\uFF0C\u4F46 ",paraId:31,tocIndex:16},{value:"X-Device-ID",paraId:31,tocIndex:16},{value:" \u51E0\u4E4E\u662F\u5168\u91CF\u63A5\u53E3\u7684\u6807\u51C6\u914D\u7F6E\u3002",paraId:31,tocIndex:16},{value:"\u4EE5\u4E0B\u662F\u4E24\u79CD\u7B56\u7565\u7684\u8BE6\u7EC6\u5BF9\u6BD4\u4EE5\u53CA\u4E3B\u6D41\u5927\u5382\u7684\u5B9E\u8DF5\u505A\u6CD5\uFF1A",paraId:32,tocIndex:16},{value:"\u5927\u5382\u901A\u5E38\u91C7\u7528\u201C",paraId:33,tocIndex:17},{value:"\u5E38\u6001\u5316\u8BBE\u5907\u6807\u8BC6 + \u5173\u952E\u8282\u70B9\u98CE\u9669\u6821\u9A8C",paraId:33,tocIndex:17},{value:"\u201D\u7684\u7EC4\u5408\u6A21\u5F0F\u3002",paraId:33,tocIndex:17},{value:"A. \u5168\u91CF\u5E26\u4E0A\uFF1A",paraId:4},{value:"X-Device-ID",paraId:4},{value:" (\u8BBE\u5907\u6307\u7EB9/\u6807\u8BC6)",paraId:4},{value:"\u8986\u76D6\u8303\u56F4\uFF1A",paraId:34,tocIndex:18},{value:" 99% \u7684\u63A5\u53E3\uFF08\u5305\u62EC\u57CB\u70B9\u3001\u914D\u7F6E\u62C9\u53D6\u3001\u4E1A\u52A1\u8BF7\u6C42\uFF09\u3002",paraId:34,tocIndex:18},{value:"\u76EE\u7684\uFF1A",paraId:34,tocIndex:18},{value:" \u7528\u4E8E",paraId:34,tocIndex:18},{value:"\u7528\u6237\u884C\u4E3A\u5206\u6790",paraId:34,tocIndex:18},{value:"\u3001",paraId:34,tocIndex:18},{value:"\u7070\u5EA6\u53D1\u5E03",paraId:34,tocIndex:18},{value:"\u3001",paraId:34,tocIndex:18},{value:"\u8BBE\u5907\u9ED1\u540D\u5355",paraId:34,tocIndex:18},{value:"\u3001\u4EE5\u53CA\u57FA\u7840\u7684\u9650\u6D41\u3002",paraId:34,tocIndex:18},{value:"\u5927\u5382\u5B9E\u8DF5\uFF1A",paraId:34,tocIndex:18},{value:" \u65E0\u8BBA\u7528\u6237\u662F\u5426\u767B\u5F55\uFF0CHeader \u4E2D\u90FD\u4F1A\u643A\u5E26\u4E00\u4E2A\u552F\u4E00\u7684 ",paraId:34,tocIndex:18},{value:"Device-ID",paraId:34,tocIndex:18},{value:" \u6216 ",paraId:34,tocIndex:18},{value:"Fingerprint-ID",paraId:34,tocIndex:18},{value:"\u3002",paraId:34,tocIndex:18},{value:"B. \u5173\u952E\u8282\u70B9\u5E26\u4E0A\uFF1A",paraId:4},{value:"X-Risk-Token",paraId:4},{value:" (\u98CE\u9669\u4EE4\u724C)",paraId:4},{value:"\u8986\u76D6\u8303\u56F4\uFF1A",paraId:35,tocIndex:19},{value:" \u4EC5\u9650\u201C\u9AD8\u98CE\u9669\u201D\u6216\u201C\u654F\u611F\u201D\u63A5\u53E3\u3002",paraId:35,tocIndex:19},{value:"\u573A\u666F\u4E3E\u4F8B\uFF1A",paraId:35,tocIndex:19},{value:"\u767B\u5F55/\u6CE8\u518C/\u627E\u56DE\u5BC6\u7801",paraId:36,tocIndex:19},{value:"\uFF08\u9632\u6B62\u649E\u5E93\u3001\u673A\u5668\u6CE8\u518C\uFF09\u3002",paraId:36,tocIndex:19},{value:"\u652F\u4ED8/\u63D0\u73B0/\u4FEE\u6539\u7ED1\u5B9A\u624B\u673A",paraId:36,tocIndex:19},{value:"\uFF08\u8D44\u91D1\u5B89\u5168\uFF09\u3002",paraId:36,tocIndex:19},{value:"\u8425\u9500\u6D3B\u52A8\u9886\u5238/\u62BD\u5956",paraId:36,tocIndex:19},{value:"\uFF08\u9632\u6B62\u7F8A\u6BDB\u515A\uFF09\u3002",paraId:36,tocIndex:19},{value:"\u53D1\u5E03\u8BC4\u8BBA/\u79C1\u4FE1",paraId:36,tocIndex:19},{value:"\uFF08\u9632\u6B62\u5783\u573E\u4FE1\u606F\u704C\u6C34\uFF09\u3002",paraId:36,tocIndex:19},{value:"\u539F\u56E0\uFF1A",paraId:35,tocIndex:19},{value:" ",paraId:35,tocIndex:19},{value:"Risk-Token",paraId:35,tocIndex:19},{value:" \u7684\u8BA1\u7B97\u901A\u5E38\u6D89\u53CA\u590D\u6742\u7684\u6307\u7EB9\u6536\u96C6\u548C\u52A0\u89E3\u5BC6\uFF0C\u5982\u679C\u5168\u91CF\u5E26\u4E0A\uFF0C\u4F1A\u589E\u52A0\u524D\u7AEF\u529F\u8017\u548C\u540E\u7AEF\u7684\u89E3\u5BC6\u538B\u529B\uFF08\u8BA1\u7B97\u6210\u672C\uFF09\u3002",paraId:35,tocIndex:19},{value:"\u7EF4\u5EA6",paraId:37,tocIndex:20},{value:"\u65B9\u6848\u4E00\uFF1A\u4EC5\u767B\u5F55/\u654F\u611F\u63A5\u53E3\u5E26",paraId:37,tocIndex:20},{value:"\u65B9\u6848\u4E8C\uFF1A\u5168\u91CF\u63A5\u53E3\u5E26",paraId:37,tocIndex:20},{value:"\u6027\u80FD\u635F\u8017",paraId:37,tocIndex:20},{value:"\u4F4E",paraId:37,tocIndex:20},{value:"\uFF08\u540E\u7AEF\u53EA\u5728\u7279\u5B9A\u63A5\u53E3\u505A\u6821\u9A8C\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u9AD8",paraId:37,tocIndex:20},{value:"\uFF08\u62E6\u622A\u5668\u6BCF\u5355\u8BF7\u6C42\u90FD\u8981\u89E3\u5BC6\u6821\u9A8C\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u5F00\u53D1\u590D\u6742\u5EA6",paraId:37,tocIndex:20},{value:"\u4E2D",paraId:37,tocIndex:20},{value:"\uFF08\u9700\u8981\u5B9A\u4E49\u54EA\u4E9B\u63A5\u53E3\u662F\u201C\u654F\u611F\u201D\u7684\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u4F4E",paraId:37,tocIndex:20},{value:"\uFF08\u4E00\u52B3\u6C38\u9038\uFF0C\u62E6\u622A\u5668\u5168\u6321\u4F4F\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u5B89\u5168\u6027",paraId:37,tocIndex:20},{value:"\u9AD8",paraId:37,tocIndex:20},{value:"\uFF08\u9488\u5BF9\u6027\u9632\u5FA1\uFF0C\u653B\u51FB\u8005\u96BE\u4EE5\u6A21\u62DF\u6838\u5FC3\u903B\u8F91\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u6781\u9AD8",paraId:37,tocIndex:20},{value:"\uFF08\u7406\u8BBA\u4E0A\u5168\u94FE\u8DEF\u9632\u722C\uFF0C\u4F46\u5BB9\u6613\u8BEF\u4F24\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u5927\u5382\u8D8B\u52BF",paraId:37,tocIndex:20},{value:"\u4E3B\u6D41",paraId:37,tocIndex:20},{value:"\uFF08\u5982\uFF1A\u4E1A\u52A1\u7F51\u5173\u6839\u636E\u8DEF\u7531\u6807\u7B7E\u5224\u65AD\u662F\u5426\u6821\u9A8C Risk\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u5C11\u89C1",paraId:37,tocIndex:20},{value:"\uFF08\u9664\u975E\u662F\u6781\u9AD8\u5B89\u5168\u7B49\u7EA7\u7684\u5E94\u7528\uFF0C\u5982\u94F6\u884C/\u7535\u5B50\u94B1\u5305\uFF09\u3002",paraId:37,tocIndex:20},{value:"\u6027\u80FD\u74F6\u9888\uFF1A",paraId:38,tocIndex:21},{value:" ",paraId:38,tocIndex:21},{value:"Risk-Token",paraId:38,tocIndex:21},{value:" \u7684\u751F\u6210\u901A\u5E38\u4F9D\u8D56 ",paraId:38,tocIndex:21},{value:"tempKey",paraId:38,tocIndex:21},{value:"\u3002\u5982\u679C\u5168\u91CF\u5E26\uFF0C\u610F\u5473\u7740\u524D\u7AEF\u6BCF\u53D1\u4E00\u4E2A\u666E\u901A\u8BF7\u6C42\uFF08\u6BD4\u5982\u83B7\u53D6\u4E2A\u4EBA\u5934\u50CF\uFF09\uFF0C\u90FD\u8981\u91CD\u65B0\u8BA1\u7B97 Token\uFF0C\u540E\u7AEF\u8FD8\u8981\u67E5 Redis \u6821\u9A8C\uFF0C\u8FD9\u4F1A\u5BFC\u81F4\u54CD\u5E94\u5EF6\u8FDF\u660E\u663E\u589E\u52A0\u3002",paraId:38,tocIndex:21},{value:"\u524D\u7AEF\u4F53\u9A8C\uFF1A",paraId:38,tocIndex:21},{value:" \u5982\u679C ",paraId:38,tocIndex:21},{value:"tempKey",paraId:38,tocIndex:21},{value:" \u66F4\u65B0\u5931\u8D25\uFF0C\u4F1A\u5BFC\u81F4\u7528\u6237\u8FDE\u201C\u5237\u4E2A\u52A8\u6001\u201D\u90FD\u770B\u4E0D\u4E86\uFF0C\u8FD9\u79CD**\u201C\u8BEF\u4F24\u201D**\u5BF9\u7528\u6237\u4F53\u9A8C\u662F\u81F4\u547D\u7684\u3002",paraId:38,tocIndex:21},{value:"CDN \u7F13\u5B58\u5931\u6548\uFF1A",paraId:38,tocIndex:21},{value:" \u5F88\u591A\u53EA\u8BFB\u63A5\u53E3\uFF08\u5982\u5546\u54C1\u8BE6\u60C5\u9875\uFF09\u662F\u53EF\u4EE5\u5728 CDN \u7F13\u5B58\u7684\u3002\u5982\u679C\u52A0\u4E0A\u4E86\u52A8\u6001\u751F\u6210\u7684 ",paraId:38,tocIndex:21},{value:"X-Risk-Token",paraId:38,tocIndex:21},{value:"\uFF0CCDN \u5C31\u65E0\u6CD5\u6709\u6548\u7F13\u5B58\u8FD9\u4E9B\u8BF7\u6C42\u3002",paraId:38,tocIndex:21},{value:"\u5982\u679C\u4F60\u73B0\u5728\u7684\u9879\u76EE\u5904\u4E8E\u589E\u957F\u671F\uFF0C\u6211\u5EFA\u8BAE\u4F60\u91C7\u53D6**\u201C\u7F51\u5173\u52A8\u6001\u6821\u9A8C\u201D**\u6A21\u5F0F\uFF1A",paraId:39,tocIndex:22},{value:"\u9ED8\u8BA4\u914D\u7F6E\uFF1A",paraId:40,tocIndex:22},{value:" \u6240\u6709\u63A5\u53E3\u5728 Header \u4E2D\u643A\u5E26 ",paraId:40,tocIndex:22},{value:"X-Device-ID",paraId:40,tocIndex:22},{value:"\u3002",paraId:40,tocIndex:22},{value:"\u52A8\u6001\u62E6\u622A\uFF1A",paraId:40,tocIndex:22},{value:" \u5B9A\u4E49\u4E00\u4E2A\u6CE8\u89E3\uFF08\u5982 ",paraId:40,tocIndex:22},{value:"@RiskCheck",paraId:40,tocIndex:22},{value:"\uFF09\uFF0C\u53EA\u52A0\u5728 ",paraId:40,tocIndex:22},{value:"LoginController",paraId:40,tocIndex:22},{value:"\u3001",paraId:40,tocIndex:22},{value:"PayController",paraId:40,tocIndex:22},{value:" \u7B49\u654F\u611F\u63A5\u53E3\u4E0A\u3002",paraId:40,tocIndex:22},{value:"\u62E6\u622A\u5668\u903B\u8F91\uFF1A",paraId:40,tocIndex:22},{value:"\u62E6\u622A\u5668\u68C0\u67E5\u76EE\u6807\u65B9\u6CD5\u662F\u5426\u6709 ",paraId:41,tocIndex:22},{value:"@RiskCheck",paraId:41,tocIndex:22},{value:"\u3002",paraId:41,tocIndex:22},{value:"\u5982\u679C\u6709\uFF0C\u6267\u884C ",paraId:41,tocIndex:22},{value:"X-Risk-Token",paraId:41,tocIndex:22},{value:" \u6821\u9A8C\u903B\u8F91\uFF08\u89E3\u5BC6\u3001\u6709\u6548\u671F\u68C0\u67E5\u3001",paraId:41,tocIndex:22},{value:"tempKey",paraId:41,tocIndex:22},{value:" \u6D88\u8017\uFF09\u3002",paraId:41,tocIndex:22},{value:"\u5982\u679C\u6CA1\u6709\uFF0C\u76F4\u63A5\u653E\u884C\u3002",paraId:41,tocIndex:22},{value:"\u603B\u7ED3\uFF1A",paraId:4},{value:"\u5927\u5382\u7528\u5F97\u66F4\u591A\u7684\u662F\uFF1A",paraId:42,tocIndex:23},{value:" ",paraId:42,tocIndex:23},{value:"\u5168\u91CF\u5E26 ",paraId:42,tocIndex:23},{value:"Device-ID",paraId:42,tocIndex:23},{value:"\uFF0C\u4EC5\u5728\u767B\u5F55\u53CA\u654F\u611F\u4E1A\u52A1\u63A5\u53E3\u5E26 ",paraId:42,tocIndex:23},{value:"Risk-Token",paraId:42,tocIndex:23},{value:"\u3002",paraId:42,tocIndex:23}]}}]);
